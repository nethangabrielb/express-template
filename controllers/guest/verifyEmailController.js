import { validateEmail } from "../../validators/user/email.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const verifyEmailController = (() => {
  const sendVerification = [
    validateEmail,
    async (req, res) => {
      const { email } = req.body;

      // Get user associated with this email
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user.emailVerified) {
        return res.status(400).json({
          code: "REQ_INVALID",
          message: "Email is already verified.",
          status: 400,
        });
      }

      if (!user) {
        return res.status(400).json({
          code: "NOT_FOUND",
          message: "User not found.",
          status: 400,
        });
      }

      // Create JWT token
      const token = jwt.sign({ email }, process.env.JWT_SECRET);

      // Generate link to be sent to the user for verification
      const link = `${process.env.SERVER_URL}/verify-email/${token}`;

      // Render email template and
      // send the rendered EJS template with verification link
      // to the email
      const templatePath = path.join(
        process.cwd(),
        "views/emails",
        "verifyEmail.ejs"
      );

      ejs.renderFile(
        templatePath,
        {
          verificationLink: link,
          userName: user.username,
          linkedinUrl: "https://www.linkedin.com/in/nethangabrielb/",
          githubUrl: "https://github.com/nethangabrielb",
          currentYear: new Date().getFullYear(),
          yourAddress: "bagasbas.nethangabriel@gmail.com",
        },
        async (err, html) => {
          if (err) {
            return res.status(500).json({
              code: "RENDER_ERROR",
              message: "Error rendering email template.",
              status: 500,
            });
          } else {
            // Send an email to the email address with the
            // verification link
            const info = await transporter.sendMail({
              from: '"Example" <example@example.com>',
              to: email,
              subject: "Verify Email",
              html,
            });

            if (info.response.includes("250 Accepted")) {
              return res.status(200).json({
                code: "EMAIL_SENT",
                message: "Verification sent! Please check your inbox.",
                status: 200,
                data: token,
              });
            }
          }
        }
      );
    },
  ];

  const verifyEmail = async (req, res) => {
    const token = req.params.verificationToken;
    let email = null;

    if (!token) {
      return res.status(400).json({
        code: "TOKEN_EMPTY",
        message: "Token is required.",
        status: 400,
      });
    }

    // Verify and Decode JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          code: "INVALID_TOKEN",
          message: "Token is invalid.",
          status: 400,
        });
      }
      email = decoded.email;
    });

    // Check if user with that email exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "Email not found.",
        status: 404,
      });
    }

    // Otherwise update email as verified
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });

    return res.redirect(`${process.env.CLIENT_URL}/email-verified`);
  };

  return { sendVerification, verifyEmail };
})();

export default verifyEmailController;

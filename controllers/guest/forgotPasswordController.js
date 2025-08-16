import { validateEmail } from "../../validators/user/email.js";
import { PrismaClient } from "../../generated/prisma/client.js";
import generateSixDigitCode from "../../utils/generateSixDigitCode.js";
import setExpiry from "../../utils/setExpiry.js";
import nodemailer from "nodemailer";
import path from "path";
import ejs from "ejs";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const forgotPasswordController = (() => {
  const forgotPassword = [
    validateEmail,
    async (req, res) => {
      const { email } = req.body;

      // Check if user with email exists and
      // if their email is verified
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(404).json({
          code: "USER_NOT_FOUND",
          message: "This email is not associated with any users.",
          status: 404,
        });
      } else if (!user.emailVerified) {
        return res.status(403).json({
          code: "EMAIL_UNVERIFIED",
          message: "Please verify your email first.",
          status: 403,
        });
      }

      // Generate six-digit code
      const code = generateSixDigitCode();

      // Store 6-digit code in the database
      const data = await prisma.otp.create({
        data: {
          userId: user.id,
          code,
          expiresAt: setExpiry(),
        },
      });

      // Render email template and
      // send the rendered EJS template with 6-digit OTP code
      // then end req-res cycle
      const templatePath = path.join(
        process.cwd(),
        "views/emails",
        "resetPassword.ejs"
      );

      ejs.renderFile(
        templatePath,
        {
          userName: user.username,
          linkedinUrl: "https://www.linkedin.com/in/nethangabrielb/",
          githubUrl: "https://github.com/nethangabrielb",
          currentYear: new Date().getFullYear(),
          yourAddress: "bagasbas.nethangabriel@gmail.com",
          code,
        },
        async (err, html) => {
          if (err) {
            return res.status(500).json({
              code: "RENDER_ERROR",
              message: "Error rendering email template.",
              status: 500,
            });
          } else {
            // Send an email to the email address with the OTP
            const info = await transporter.sendMail({
              from: '"Example" <example@example.com>',
              to: email,
              subject: "Password Reset OTP",
              html,
            });

            if (info.response.includes("250 Accepted")) {
              return res.status(201).json({
                code: "EMAIL_SENT",
                message: "OTP code sent. Please check your inbox.",
                status: 201,
                data,
              });
            }
          }
        }
      );
    },
  ];

  return { forgotPassword };
})();

export default forgotPasswordController;

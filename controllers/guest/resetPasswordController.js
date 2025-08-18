import { PrismaClient } from "../../generated/prisma/client.js";
import { validatePassword } from "../../validators/user/passwordChange.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const resetPasswordController = (() => {
  const resetPassword = [
    validatePassword,
    async (req, res) => {
      try {
        const { password, token } = req.body;
        let id = null;

        if (!token) {
          return res.status(400).json({
            code: "TOKEN_UNDEFINED",
            message: "Token is required.",
            status: 400,
          });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
          if (err) {
            return res.status(500).json({
              code: "INTERNAL_ERROR",
              message: "There was an error verifying token.",
              status: 500,
              data: err,
            });
          }
          id = payload.id;
        });

        const userExists = await prisma.user.findUnique({
          where: {
            id,
          },
        });

        if (!userExists) {
          return res.status(404).json({
            code: "USER_NOT_FOUND",
            message: "User not found.",
            status: 404,
          });
        }

        const hashedPassword = await bcrypt.hash(password, 15);

        const user = await prisma.user.update({
          where: {
            id,
          },
          data: {
            password: hashedPassword,
          },
        });

        return res.status(200).json({
          code: "PASSWORD_RESET_SUCCESS",
          message: "Password is reset successfuly!",
          status: 200,
          data: {
            user,
          },
        });
      } catch (e) {
        return res.status(500).json({
          code: "INVALID_REQUEST",
          message: "There was an error processing your request.",
          status: 500,
          data: e,
        });
      }
    },
  ];

  return { resetPassword };
})();

export default resetPasswordController;

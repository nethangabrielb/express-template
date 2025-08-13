import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import { validateRegistration } from "../../validators/user/registration.js";

const registerController = (() => {
  const prisma = new PrismaClient();

  const register = [
    validateRegistration,
    async (req, res) => {
      try {
        const { username, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 15);

        // Check if username is already taken
        const user = await prisma.user.findFirst({
          where: {
            username,
          },
        });

        if (user.username === username) {
          res.status(400).json({
            code: "USERNAME_ALREADY_EXISTS",
            message: "Username is already taken.",
            status: 400,
          });
        }

        // Register
        const registeredUser = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
          },
        });

        res.status(201).json({
          code: "REGISTER_SUCCESS",
          message: "Registered successfully!",
          status: 201,
          data: registeredUser,
        });
      } catch (e) {
        res.status(400).json({
          code: "REGISTER_FAILED",
          message: e.message,
          status: 400,
        });
      }
    },
  ];

  return { register };
})();

export default registerController;

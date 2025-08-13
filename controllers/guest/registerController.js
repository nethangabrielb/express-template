import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import { validateRegistration } from "../../validators/user/registration.js";

const registerController = (() => {
  const prisma = new PrismaClient();

  const register = [
    validateRegistration,
    async (req, res) => {
      try {
        const { username, email, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 15);

        // Register
        const registeredUser = await prisma.user.create({
          data: {
            username,
            email,
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

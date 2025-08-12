import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import { validateRegistration } from "../../validators/user/registration.js";

const registerController = (() => {
  const prisma = new PrismaClient();

  const register = [
    validateRegistration,
    async (req, res) => {
      // Register user in the database
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 15);

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
    },
  ];

  return { register };
})();

export default registerController;

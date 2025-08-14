import { PrismaClient } from "../../generated/prisma/client.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginController = (() => {
  const prisma = new PrismaClient();

  const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: "LOGIN_FIELDS_MISSING",
        message: "Login fields are missing.",
        status: 400,
      });
    }

    // Find user in the database
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // Return error if user is not found
    if (!user) {
      return res.status(404).json({
        code: "INVALID_USERNAME",
        message: "Username not found.",
        status: 404,
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        code: "INVALID_PASSWORD",
        message: "Password is incorrect.",
        status: 401,
      });
    }

    // Generate jwt token
    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.json({
      code: "LOGIN_SUCCESS",
      message: "Logged in successfuly!",
      status: 200,
      data: {
        token,
      },
    });
  };

  return { login };
})();

export default loginController;

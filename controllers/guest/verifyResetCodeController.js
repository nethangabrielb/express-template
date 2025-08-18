import { PrismaClient } from "../../generated/prisma/client.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const verifyResetCodeController = (() => {
  const verifyResetCode = async (req, res) => {
    const { code, email } = req.body;

    // Check if OTP exists in DB
    const otpExists = await prisma.otp.findFirst({
      where: {
        code,
      },
      include: {
        User: true,
      },
    });

    if (!otpExists) {
      return res.status(404).json({
        code: "OTP_INVALID",
        message: "Invalid OTP! Please try again.",
        status: 404,
      });
    }

    // Check if code is associated with the user making the request
    const isAssociated = email === otpExists.User.email;
    if (!isAssociated) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Invalid OTP! Please try again.",
        status: 401,
      });
    }

    // Create token with user information as payload
    const token = jwt.sign({ id: otpExists.User.id }, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    await prisma.otp.delete({
      where: {
        code,
      },
    });

    res.status(200).json({
      code: "VERIFIED_SUCCESS",
      message: "You are now authorized to change your password.",
      status: 200,
      data: { token },
    });
  };

  return { verifyResetCode };
})();

export default verifyResetCodeController;

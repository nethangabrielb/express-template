import { body } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

export default body("email")
  .exists()
  .withMessage("Email is required.")
  .trim()
  .notEmpty()
  .withMessage("Email can't be empty.")
  .isEmail()
  .withMessage("Input must be an email.")
  .custom(async (value) => {
    const user = await prisma.user.findFirst({
      where: {
        email: value,
      },
    });
    if (!user) return true;
    return value !== user.email;
  })
  .withMessage("Email already exists.");

import { body, validationResult } from "express-validator";
import { PrismaClient } from "../../generated/prisma/client.js";

const prisma = new PrismaClient();

const registrationValidation = [
  body("username")
    .exists()
    .withMessage("Username is required.")
    .trim()
    .notEmpty()
    .withMessage("Username can't be empty.")
    .custom(async (value) => {
      const user = await prisma.user.findFirst({
        where: {
          username: value,
        },
      });
      if (!user) return true;
      return value !== user.username;
    })
    .withMessage("Username already exists."),
  body("email")
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
    .withMessage("Email already exists."),
  body("password")
    .exists()
    .withMessage("Password is required.")
    .trim()
    .notEmpty()
    .withMessage("Password can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must have a minimum of 8 characters."),
  body("confirmPassword")
    .exists()
    .withMessage("Confirm password is required.")
    .trim()
    .notEmpty()
    .withMessage("Password confirmation can't be empty.")
    .isLength({ min: 8 })
    .withMessage("Password confirmation must have a minimum of 8 characters.")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match."),
];

const validateRegistration = [
  registrationValidation,
  (req, res, next) => {
    // Retrieve errors from express-validator on input fields
    const errors = validationResult(req);

    // Return errors if there are any
    if (!errors.isEmpty()) {
      const errorsArr = errors.array({ onlyFirstError: true });
      return res.json({
        code: "INVALID_INPUT",
        message: errorsArr.map((err) => err.msg),
        statusCode: 400,
      });
    } else {
      next();
    }
  },
];

export { validateRegistration };

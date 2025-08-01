const { PrismaClient } = require("../../generated/prisma");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const registerController = (() => {
  const prisma = new PrismaClient();
  /**
   * Guest registration field validations
   */
  const validateRegistration = [
    body("username")
      .exists()
      .withMessage("Username is required")
      .trim()
      .notEmpty()
      .withMessage("Username can't be empty."),
    body("password")
      .exists()
      .withMessage("Password is required.")
      .trim()
      .notEmpty()
      .withMessage("Password can't be empty")
      .isLength({ min: 8 })
      .withMessage("Password must have a minimum of 8 characters."),
    body("confirmPassword")
      .exists()
      .withMessage("Confirm password is required.")
      .trim()
      .notEmpty()
      .withMessage("Password confirmation can't be empty")
      .isLength({ min: 8 })
      .withMessage("Password confirmation must have a minimum of 8 characters")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .withMessage("Passwords do not match."),
  ];

  const register = [
    validateRegistration,
    async (req, res) => {
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
      }

      // Register user in the database
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 15);

      const registeredUser = await prisma.user.create({
        data: {
          username,
          hashedPassword,
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

module.exports = registerController;

import { body } from "express-validator";

export default body("confirmPassword")
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
  .withMessage("Passwords do not match.");

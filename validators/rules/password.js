import { body } from "express-validator";

export default body("password")
  .exists()
  .withMessage("Password is required.")
  .trim()
  .notEmpty()
  .withMessage("Password can't be empty.")
  .isLength({ min: 8 })
  .withMessage("Password must have a minimum of 8 characters.");

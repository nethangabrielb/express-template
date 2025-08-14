import { validationResult } from "express-validator";
import email from "../rules/email.js";

const emailValidation = [email];

const validateEmail = [
  emailValidation,
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

export { validateEmail };

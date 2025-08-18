import { validationResult } from "express-validator";
import confirmPassword from "../rules/confirmPassword.js";
import password from "../rules/password.js";

const passwordValidation = [password, confirmPassword];

const validatePassword = [
  passwordValidation,
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

export { validatePassword };

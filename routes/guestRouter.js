import express from "express";
import loginController from "../controllers/guest/loginController.js";
import registerController from "../controllers/guest/registerController.js";
import forgotPasswordController from "../controllers/guest/forgotPasswordController.js";
import verifyEmailController from "../controllers/guest/verifyEmailController.js";
import verifyResetCodeController from "../controllers/guest/verifyResetCodeController.js";
import resetPasswordController from "../controllers/guest/resetPasswordController.js";

const { Router } = express;
const guestRouter = Router();

// Register
guestRouter.post("/register", registerController.register);

// Login
guestRouter.post("/login", loginController.login);

// Reset Password
guestRouter.post("/forgot-password", forgotPasswordController.forgotPassword);
guestRouter.post("/verify-code", verifyResetCodeController.verifyResetCode);
guestRouter.put("/reset-password", resetPasswordController.resetPassword);

// Verify Email
guestRouter.post("/verify-email", verifyEmailController.sendVerification);
guestRouter.get(
  "/verify-email/:verificationToken",
  verifyEmailController.verifyEmail
);

export default guestRouter;

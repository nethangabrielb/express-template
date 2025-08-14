import express from "express";
import loginController from "../controllers/guest/loginController.js";
import registerController from "../controllers/guest/registerController.js";
import forgotPasswordController from "../controllers/guest/forgotPasswordController.js";
import verifyEmailController from "../controllers/guest/verifyEmailController.js";

const { Router } = express;
const guestRouter = Router();

// Register
guestRouter.post("/register", registerController.register);

// Login
guestRouter.post("/login", loginController.login);

// Forgot Password
guestRouter.get("/forgot-password", forgotPasswordController.forgotPassword);

// Verify Email
guestRouter.get("/verify-email", verifyEmailController.verifyEmail);

export default guestRouter;

import express from "express";
import loginController from "../controllers/guest/loginController.js";
import registerController from "../controllers/guest/registerController.js";
import forgotPasswordController from "../controllers/guest/forgotPasswordController.js";

const { Router } = express;
const guestRouter = Router();

// Register
guestRouter.post("/register", registerController.register);

// Login
guestRouter.post("/login", loginController.login);

// Forgot Password
guestRouter.get("/forgot-password", forgotPasswordController.forgotPassword);

export default guestRouter;

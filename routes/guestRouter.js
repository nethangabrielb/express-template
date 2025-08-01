import express from "express";
import loginController from "../controllers/guest/loginUser.js";
import registerController from "../controllers/guest/registerUser.js";

const { Router } = express;
const guestRouter = Router();

// Register
guestRouter.post("/register", registerController.register);

// Login
guestRouter.post("/login", loginController.login);

export default guestRouter;

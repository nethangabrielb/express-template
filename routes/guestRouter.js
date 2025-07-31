const express = require("express");
const { Router } = express;
const loginController = require("../controllers/guest/loginUser");
const registerController = require("../controllers/guest/registerUser");

const guestRouter = Router();

// Register
guestRouter.post("/register", registerController.register);

// Login
guestRouter.post("/login", loginController.login);

module.exports = guestRouter;

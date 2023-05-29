const express = require("express");
const AuthController = require("../controllers/authController");
const authRoute = express.Router();

authRoute.post("/register", AuthController.userRegistration);
authRoute.post("/login", AuthController.userLogin);
authRoute.get("/otp", AuthController.getOTP);

module.exports = authRoute;

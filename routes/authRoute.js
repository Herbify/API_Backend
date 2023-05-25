const express = require("express");
const AuthController = require("../controllers/authController");
const authRoute = express.Router();

authRoute.post("/register", AuthController.userRegistration);
authRoute.post("/login", AuthController.userLogin);
authRoute.get("/otp/:id", AuthController.getOTP);
authRoute.post("/otp/verify", AuthController.verifyOTP);
authRoute.post("/otp/:id", AuthController.requestOTP);

module.exports = authRoute;

const express = require("express");
const userRoute = express.Router();
const { getAllUser, getUserById } = require("../controllers/userController");

userRoute.get("/", getAllUser);
userRoute.get("/:id", getUserById);

module.exports = userRoute;

const express = require("express");
const UserController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/", UserController.getAllUser);
userRoute.post("/", UserController.createUser);
userRoute.get("/detail", UserController.getUserByEmail);
userRoute.get("/:id", UserController.getUserById);

module.exports = userRoute;

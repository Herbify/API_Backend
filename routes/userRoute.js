const express = require("express");
const UserController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.get("/", UserController.getAllUser);
userRoute.get("/detail", UserController.getUserByEmail);
userRoute.get("/:id", UserController.getUserById);
userRoute.put("/:id", UserController.updateUser);

module.exports = userRoute;

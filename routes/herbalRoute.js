const express = require("express");
const multer = require("multer");
const HerbalController = require("../controllers/herbalController");
const herbalRoute = express.Router();

const upload = multer();

herbalRoute.get("/", HerbalController.getHerbalList);
herbalRoute.post("/", upload.single("image"), HerbalController.addHerbal);
herbalRoute.get("/:id", HerbalController.getHerbalById);
herbalRoute.put("/:id", upload.single("image"), HerbalController.updateHerbalById);

module.exports = herbalRoute;
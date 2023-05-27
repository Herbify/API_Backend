const express = require("express");
const HerbalController = require("../controllers/herbalController");
const herbalRoute = express.Router();

herbalRoute.get("/", HerbalController.getHerbalList);
herbalRoute.post("/", HerbalController.addHerbal);
herbalRoute.get("/:id", HerbalController.getHerbalById);
herbalRoute.put("/:id", HerbalController.updateHerbalById);

module.exports = herbalRoute;

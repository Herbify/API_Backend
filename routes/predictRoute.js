const express = require("express");
const PredictController = require("../controllers/predictController");
const predictRoute = express.Router();

predictRoute.post("/chatbot", PredictController.predictChatbotAnswer);

module.exports = predictRoute;

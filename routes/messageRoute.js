const express = require("express");
const MessageController = require("../controllers/messageController");
const messageRoute = express.Router();

messageRoute.get("/conversation", MessageController.getAllConversations);
messageRoute.get("/conversation/:id", MessageController.getConversationById);
messageRoute.post("/send", MessageController.sendMessage);
messageRoute.get("/room/:id", MessageController.getUserMessageRoom);
messageRoute.post("/room", MessageController.createMessageRoom);
messageRoute.put("/room/:id", MessageController.finishChat);
messageRoute.get("/payment", MessageController.getPayment);

module.exports = messageRoute;

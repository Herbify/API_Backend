const express = require("express");
const MessageController = require("../controllers/messageController");
const messageRoute = express.Router();

messageRoute.get("/", MessageController.getAllConversations);
messageRoute.get("/conversation", MessageController.getUserConversation);
messageRoute.post("/send", MessageController.sendMessage);

module.exports = messageRoute;
const express = require("express");
const articleRoute = express.Router();
const { getAllArticle, getArticleById, createArticle, editArticle, deleteArticle, getAllArticleByUserId, likeArticle } = require("../controllers/articleController");

articleRoute.get("/", getAllArticle);
articleRoute.get("/:id", getArticleById);
articleRoute.post("/", createArticle);
articleRoute.put("/:id", editArticle);
articleRoute.delete("/:id", deleteArticle);
articleRoute.get("/user/:id", getAllArticleByUserId);
articleRoute.get("/:id/like", likeArticle);
//:id/like
//api/article/:id?like=1/0

module.exports = articleRoute;

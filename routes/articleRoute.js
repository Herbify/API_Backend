const express = require("express");
const ArticleController = require("../controllers/articleController");
const articleRoute = express.Router();

articleRoute.get("/", ArticleController.getAllArticle);
articleRoute.get("/:id", ArticleController.getArticleById);
articleRoute.post("/", ArticleController.createArticle);
articleRoute.put("/:id", ArticleController.editArticle);
articleRoute.delete("/:id", ArticleController.deleteArticle);
articleRoute.get("/user/:id", ArticleController.getAllArticleByUserId);
articleRoute.get("/:id/like", ArticleController.likeArticle);

module.exports = articleRoute;

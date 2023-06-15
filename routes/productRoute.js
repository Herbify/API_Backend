const express = require("express");
const ProductController = require("../controllers/productController");
const productRoute = express.Router();

productRoute.get("/", ProductController.getProductList);
productRoute.get("/search", ProductController.searchProductByIngredients);
productRoute.get("/:id", ProductController.getProductById);
productRoute.post("/", ProductController.createProduct);

module.exports = productRoute;

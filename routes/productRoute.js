const express = require("express");
const productRoute = express.Router();
const { getAllProduct, getProductById, createProduct, editProduct, deleteProduct, getProductByIngredient } = require("../controllers/productController");

productRoute.get("/", getAllProduct);
productRoute.get("/ingredient", getProductByIngredient);
productRoute.get("/:id", getProductById);
productRoute.post("/", createProduct);
productRoute.put("/:id", editProduct);
productRoute.delete("/:id", deleteProduct);

module.exports = productRoute;
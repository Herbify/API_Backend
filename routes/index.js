const express = require("express");
const userRoute = require("./userRoute");
const articleRoute = require("./articleRoute");
const productRoute = require("./productRoute");
const authRoute = require("./authRoute");

const router = express.Router();

router.use(express.json())
router.use(express.urlencoded({ extended: true }));
router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/article", articleRoute);
router.use("/product", productRoute);

module.exports = router;

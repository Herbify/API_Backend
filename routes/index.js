const express = require("express");
const userRoute = require("./userRoute");
const articleRoute = require("./articleRoute");
const productRoute = require("./productRoute");

const router = express.Router();

router.use(express.json())
router.use("/user", userRoute);
router.use("/article", articleRoute);
router.use("/product", productRoute);

module.exports = router;

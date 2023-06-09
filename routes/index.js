const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const testRoute = require("./testRoute");
const herbalRoute = require("./herbalRoute");
const productRoute = require("./productRoute");
const articleRoute = require("./articleRoute");
const messageRoute = require("./messageRoute");
const doctorRoute = require("./doctorRoute");
const predictRoute = require("./predictRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/article", articleRoute);
router.use("/user", userRoute);
router.use("/doctor", doctorRoute);
router.use("/test", testRoute);
router.use("/herbal", herbalRoute);
router.use("/product", productRoute);
router.use("/predict", predictRoute);
router.use("/message", messageRoute);

module.exports = router;

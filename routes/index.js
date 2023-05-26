const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const testRoute = require("./testRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/test", testRoute);

module.exports = router;

const express = require("express");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const testRoute = require("./testRoute");
const herbalRoute = require("./herbalRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/test", testRoute);
router.use("/herbal", herbalRoute);

module.exports = router;

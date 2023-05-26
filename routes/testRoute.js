const express = require("express");
const testRoute = express.Router();

testRoute.get("/callback", (req, res) => {
  const data = req.query;
  console.log({ callbackData: data });
  res.json({
    message: "Callback tester",
    data,
  });
});

module.exports = testRoute;

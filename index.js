const express = require("express");
const app = express();
const router = require("./routes/index");

const port = 8000;

app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "API Herbify",
  });
});

app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});

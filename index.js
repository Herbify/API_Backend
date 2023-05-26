const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/index");

const app = express();

app.use(bodyParser.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "API Herbify",
  });
});

const port = 8080;
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
// const fileUpload = require("express-fileupload");
const router = require("./routes/index");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "/tmp",
// }));
app.use("/api", router);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to API Herbify",
  });
});

const port = process.env.PORT | 8080;
const type = process.env.NODE_ENV;
app.listen(port, (req, res) => {
  console.log(`Server running on port ${port} in ${type} mode`);
});
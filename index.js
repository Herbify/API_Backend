const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const router = require("./routes/index");
const http = require("http");
const socketIO = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use("/api", router);

app.get("/", (req, res) => {
  res.render("welcome");
});

const port = process.env.PORT | 8080;
const type = process.env.NODE_ENV;
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${type} mode`);
});

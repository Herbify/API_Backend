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

testRoute.get("/webhooks", (req, res) => {
  console.log("[GET] Webhook");
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === "krisna-chat-app-token") {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

testRoute.post("/webhooks", (req, res) => {
  console.log("[POST] Webhook");
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);
  console.dir(body, { depth: null });

  res.status(200).send("EVENT_TEST");
});

module.exports = testRoute;

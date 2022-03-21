const express = require("express");
const { shutDown } = require("../src/shutDown");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("hello world");
});

const server = app.listen(PORT);

shutDown(server, []);
shutDown(server, []);

const { createChildArray } = require("./src/createChildArray");
const { getRecognition } = require("./src/getRecognition");
const { findAndMarkFreeChild } = require("./src/findAndMarkFreeChild");
const express = require("express");
const shutdownPack = require("@moebius/http-graceful-shutdown");

const GracefulShutdownManager = shutdownPack.GracefulShutdownManager;

const app = express();
const PORT = 3000;

const childArray = createChildArray(5);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/img", (req, res) => {
  // TODO
  // console.log(req.body.img);
  const childObj = findAndMarkFreeChild(childArray);
  if (childObj !== null) {
    getRecognition(req.body.img, childObj.child).then((recognitionData) => {
      childObj.busy = false;
      res.json("finished getting the data! " + recognitionData);
    });
  } else {
    res.json({ error: "server could not handle the request right now" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

const shutdownManager = new GracefulShutdownManager(server);

process.on("SIGINT", () => {
  shutdownManager.terminate(() => {
    childArray.forEach((obj) => {
      console.log(`killing child with id: ${obj.id}`);
      obj.child.kill();
    });
    console.log("shut down complete");
  });
});

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

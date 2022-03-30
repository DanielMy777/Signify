const { createChildArray } = require("./src/createChildArray");
const { getRecognitionPromise } = require("./src/getRecognition");
const { getFreeChildWrapper } = require("./src/getFreeChildWrapper");
const { shutDown } = require("./src/shutDown");
const { waitForChildren } = require("./src/waitForChildren");
const express = require("express");

const app = express();
const PORT = 3000;
const CHILD_NUM = 5;
const TIME_OUT = 5000;
const PROCESS_NAME = "../SignifyService/signifyService.py";

const childArray = createChildArray(CHILD_NUM, PROCESS_NAME);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/img", async (req, res) => {
  getFreeChildWrapper(childArray, TIME_OUT)
    .then((wrapper) => {
      getRecognitionPromise(req.body.img, wrapper.child)
        .then((recognitionData) => {
          wrapper.busy = false;
          res.send(recognitionData);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.json({ error: err }));
});

waitForChildren(childArray).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  server.on("close", () => shutDown(server, childArray));
  process.on("SIGINT", () => shutDown(server, childArray));
  process.on("SIGTERM", () => shutDown(server, childArray));
});

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

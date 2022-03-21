const { createChildArray } = require("./src/createChildArray");
const { getRecognitionPromise } = require("./src/getRecognition");
const { findAndMarkFreeChild } = require("./src/findAndMarkFreeChild");
const { shutDown } = require("./src/shutDown");
const express = require("express");

const app = express();
const PORT = 3000;
const CHILD_NUM = 5;

const childArray = createChildArray(CHILD_NUM);

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/img", async (req, res) => {
  console.log("got post in /api/img");
  const childObj = findAndMarkFreeChild(childArray);

  // console.log(`childArray after find = `);
  // console.log(childArray.map((obj) => obj.busy));

  if (childObj !== null) {
    getRecognitionPromise(req.body.img, childObj.child)
      .then((recognitionData) => {
        // console.log(`recognitionData = ${recognitionData}`);
        childObj.busy = false;

        // console.log(`childArray after finishing getRecognition = `);
        // console.log(childArray.map((obj) => obj.busy));

        res.json("finished getting the data! " + recognitionData);
      })
      .catch((err) => console.log(err));
  } else {
    res.json({ error: "server could not handle the request right now" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

server.on("close", () => shutDown(server, childArray));
process.on("SIGINT", () => shutDown(server, childArray));
process.on("SIGTERM", () => shutDown(server, childArray));

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

const { createChildArray } = require("./src/createChildArray");
const { getRecognition } = require("./src/getRecognition");
const { findAndMarkFreeChild } = require("./src/findAndMarkFreeChild");
const { shutDown } = require("./src/shutDown");
const express = require("express");
const Mutex = require("async-mutex").Mutex;

const app = express();
const PORT = 3000;
const CHILD_NUM = 5;

const childArray = createChildArray(CHILD_NUM);
const mutex = new Mutex();

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/img", async (req, res) => {
  // TODO
  console.log("got post in /api/img");
  const childObj = await findAndMarkFreeChild(childArray, mutex);

  // console.log(`childArray = `);
  // console.log(childArray.map((obj) => obj.busy));

  if (childObj !== null) {
    const recognitionData = await getRecognition(req.body.img, childObj.child);
    // not sure mutex is required here, just to be safe
    const release = await mutex.acquire();
    childObj.busy = false;
    release();

    // console.log(`childArray after finishing getRecognition = `);
    // console.log(childArray.map((obj) => obj.busy));

    res.json("finished getting the data! " + recognitionData);
  } else {
    res.json({ error: "server could not handle the request right now" });
  }
});

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

process.on("SIGINT", () => shutDown(server, childArray));
process.on("SIGTERM", () => shutDown(server, childArray));

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

import { createChildArray } from "./src/createChildArray.js";
import { getRecognitionPromise } from "./src/getRecognition.js";
import { getFreeChildWrapper } from "./src/getFreeChildWrapper.js";
import { shutDown } from "./src/shutDown.js";
import { waitForChildren } from "./src/waitForChildren.js";
import { Request, Response } from "express";
import express from "express";

const app = express();
const PORT = 3000;
const CHILD_NUM = 5;
const TIME_OUT = 5000;
const PROCESS_NAME = "../SignifyService/signifyService.py";

const childArray = createChildArray(CHILD_NUM, PROCESS_NAME);

app.use(express.json({ limit: "50mb" }));

app.get("/", (_: Request, res: Response) => {
  res.send("hello world");
});

app.post("/api/img", async (req: Request, res: Response) => {
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

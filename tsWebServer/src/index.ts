import { Pool } from "./pool/pool.js";
import { shutDown } from "./util/shutDown.js";
import { Request, Response } from "express";
import express from "express";

const app = express();
const PORT = 3000;
const SIGN_CHILD_NUM = 1;
const HAND_CHILD_NUM = 1;
const IS_LETTER = true;
// const TIME_OUT = 5000;
const PROCESS_NAME = "../SignifyService/signifyService.py";

const signPool = new Pool(SIGN_CHILD_NUM, PROCESS_NAME, 0, [
  "cuda",
  "detectSign",
]);
const handPool = new Pool(HAND_CHILD_NUM, PROCESS_NAME, SIGN_CHILD_NUM, [
  "cuda",
  "noSignDetection",
]);

app.use(express.json({ limit: "50mb" }));

app.get("/", (_: Request, res: Response) => {
  res.send("hello world");
});

app.post("/api/img/DetectHands", async (req: Request, res: Response) => {
  //console.log("In Detect Hands");
  handPool
    .exec(req.body.img, IS_LETTER)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
});

app.post("/api/img/Detect2Hands", async (req: Request, res: Response) => {
  //console.log("In Detect 2Hands");
  handPool
    .exec(req.body.img, !IS_LETTER)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
});

app.post("/api/img/DetectHandsSign", async (req: Request, res: Response) => {
  //console.log("In Detect Sign");
  signPool
    .exec(req.body.img, IS_LETTER)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
});

app.post("/api/img/DetectHandsWord", async (req: Request, res: Response) => {
  //console.log("In Detect Sign");
  signPool
    .exec(req.body.img, !IS_LETTER)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => res.send(err));
});

signPool.workersReady(true).then(() => {
  handPool.workersReady(true).then(() => {
    const server = app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });

    server.on("close", () => shutDown(server, signPool, handPool));
    process.on("SIGINT", () => shutDown(server, signPool, handPool));
    process.on("SIGTERM", () => shutDown(server, signPool, handPool));
  });
});

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

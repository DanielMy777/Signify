import { Pool } from "./src/pool/pool.js";
import { shutDown } from "./src/util/shutDown.js";
import { Request, Response } from "express";
import { DetectType } from './src/detection/DetectType.js'
import express from "express";
import { executePoolRequest } from './src/server/services.js'
console.log(DetectType)
const app = express();
const PORT = 3000;
const CHILD_NUM = 1;
// const TIME_OUT = 5000;
const PROCESS_NAME = "../SignifyService/signifyService.py";

const pool = new Pool(CHILD_NUM, PROCESS_NAME);


app.use(express.json({ limit: "50mb" }));



app.get("/", (_: Request, res: Response) => {
  res.send("hello world");
});

app.post("/api/img/DetectHands", async (req: Request, res: Response) => {
  console.log("In Detect Hands");
  executePoolRequest(pool, DetectType.Hands, req, res)
})

app.post("/api/img/DetectHandsSign", async (req: Request, res: Response) => {
  console.log("In Detect Sign");
  executePoolRequest(pool, DetectType.HandsSign, req, res)
});

pool.workersReady(true).then(() => {
  const server = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });

  server.on("close", () => shutDown(server, pool));
  process.on("SIGINT", () => shutDown(server, pool));
  process.on("SIGTERM", () => shutDown(server, pool));
});

// fast client:
// curl -i -X POST -H "Content-Type: application/json" -d "{\"img\": \"1234\"}" http://127.0.0.1:3000/api/img

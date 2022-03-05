const express = require("express");
const child_proccess = require("child_process");

const app = express();
const PORT = 3000;
const spawn = child_proccess.spawn;

const getRecognition = () => {
  // TODO pass img as parameter
  let resData = "";
  const child = spawn("python", ["python_test.py", req.body.img]);

  child.stdout.on("data", (data) => {
    resData += data;
  });

  child.on("close", () => {
    console.log(resData);
  });
};

app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/api/img", (req, res) => {
  // TODO
  console.log(req.body.img);
  const recognisedData = getRecognition();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

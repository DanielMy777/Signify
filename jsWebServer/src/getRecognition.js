const { StringDecoder } = require("string_decoder");
const EventEmitter = require("events");
const decoder = new StringDecoder("utf8");

const bus = new EventEmitter();
const FINISHED_READING = "finished";

const dataEvent = (resData, data) => {
  data = decoder.write(data);
  resData += data;
  // console.log(`data after decode = ${data}`);
  if (data.slice(-1) === "\n") {
    resData = resData.trimEnd();
    bus.emit(FINISHED_READING);
  }
};

const getRecognitionPromise = (img, child) => {
  return new Promise((resolve, reject) => {
    // DEBUG
    // console.log("hello from the promise!");
    // console.log("resolve = ");
    // console.log(resolve);
    // console.log("reject = ");
    // console.log(reject);
    // console.log("img = ");
    // console.log(img);
    // console.log("child = ");
    // console.log(child);

    let resData = "";
    const listener = (data) => dataEvent(resData, data);

    // console.log("after decleration of resData and listener");

    child.stdout.on("data", listener);
    child.stdin.write(img.replace(/\s/g, "") + "\n");

    // console.log("after decleration of resData and listener");

    bus.once(FINISHED_READING, () => {
      child.stdout.removeListener("data", listener);
      resolve(resData);
    });
  });
};

module.exports = { getRecognitionPromise };

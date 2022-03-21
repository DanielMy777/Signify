const { StringDecoder } = require("string_decoder");
const EventEmitter = require("events");
const decoder = new StringDecoder("utf8");

const FINISHED_READING = "finished";

const dataEvent = (wrapper, data, bus) => {
  data = decoder.write(data);
  wrapper.resData += data;
  console.log(`data after decode = ${data}`);
  if (data.slice(-1) === "\n") {
    wrapper.resData = wrapper.resData.trimEnd();
    console.log(`finale resData = ${wrapper.resData}`);
    bus.emit(FINISHED_READING);
  }
};

const getRecognitionPromise = (img, child) => {
  return new Promise((resolve, reject) => {
    // DEBUG;
    // console.log("img = ");
    // console.log(img);

    const bus = new EventEmitter();

    let resDataWrapper = { resData: "" };
    const listener = (data) => dataEvent(resDataWrapper, data, bus);

    child.stdout.on("data", listener);
    child.stdin.write(img.replace(/\s/g, "") + "\n");

    bus.once(FINISHED_READING, () => {
      child.stdout.removeListener("data", listener);
      console.log(`resData before sending = ${resDataWrapper.resData}`);
      resolve(resDataWrapper.resData);
    });
  });
};

module.exports = { getRecognitionPromise };

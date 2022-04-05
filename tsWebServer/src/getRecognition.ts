import { StringDecoder } from "string_decoder";
import EventEmitter from "events";
import { ChildProcess } from "child_process";
const decoder = new StringDecoder("utf8");

const FINISHED_READING = "finished";

interface StringWrapper {
  resData: string;
}

const dataEvent = (
  wrapper: StringWrapper,
  dataBuff: Buffer,
  bus: EventEmitter
): void => {
  const data = decoder.write(dataBuff);
  wrapper.resData += data;
  console.log(`data after decode = ${data}`);
  if (data.slice(-1) === "\n") {
    wrapper.resData = wrapper.resData.trimEnd();
    console.log(`finale resData = ${wrapper.resData}`);
    bus.emit(FINISHED_READING);
  }
};

const getRecognitionPromise = (img: string, child: ChildProcess) => {
  return new Promise((resolve, _) => {
    // DEBUG;
    // console.log("img = ");
    // console.log(img);

    const bus = new EventEmitter();

    const resDataWrapper: StringWrapper = { resData: "" };
    const listener = (data: Buffer) => dataEvent(resDataWrapper, data, bus);

    child.stdout!.on("data", listener);
    child.stdin!.write(img.replace(/\s/g, "") + "\n");

    bus.once(FINISHED_READING, () => {
      child.stdout!.removeListener("data", listener);
      console.log(`resData before sending = ${resDataWrapper.resData}`);
      resolve(resDataWrapper.resData);
    });
  });
};

export { getRecognitionPromise };

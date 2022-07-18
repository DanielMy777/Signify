import { StringDecoder } from "string_decoder";
import EventEmitter from "events";
import { ChildProcess } from "child_process";
const decoder = new StringDecoder("utf8");

const FINISHED_READING = "finished";

const getRecognitionPromise = (
  img: string,
  child: ChildProcess
): Promise<string> => {
  return new Promise((resolve, _) => {
    const bus = new EventEmitter();
    let resData = "";
    const listener = (data: Buffer) => {
      resData += decoder.write(data);
      if (resData.slice(-1) === "\n") {
        resData = resData.trimEnd();
        // console.log(`finale resData = ${resData}`);
        bus.emit(FINISHED_READING);
      }
    };

    child.stdout!.on("data", listener);
    child.stdin!.write(img.replace(/\s/g, "") + "\n");

    bus.once(FINISHED_READING, () => {
      child.stdout!.removeListener("data", listener);
      // console.log(`resData before sending = ${resData}`);
      resolve(resData);
    });
  });
};

export { getRecognitionPromise };

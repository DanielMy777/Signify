import { getRecognitionPromise } from "./getRecognition.js";
import { spawn, ChildProcess } from "child_process";

class PyProc {
  private _id: number;
  private _child: ChildProcess;
  private _free: boolean;
  private _ready: boolean;
  private _killed: boolean;

  constructor(id: number, path: string, extraParams: string[]) {
    this._id = id;
    this._child = spawn("python", [path, `${id}`, ...extraParams]);
    this._free = true;
    this._ready = false;
    this._killed = false;
  }

  get id() {
    return this._id;
  }

  get free() {
    return this._free;
  }

  set free(val: boolean) {
    this._free = val;
  }

  get ready() {
    return this._ready;
  }

  kill() {
    this._child.kill();
    this._killed = true;
  }

  waitForSpwan(): Promise<void> {
    return new Promise((resolve, _) => {
      let readyData = "";
      const onData = (data: string) => {
        readyData += data;
        if (readyData === "ready") {
          this._child.stdout!.removeListener("data", onData);
          this._ready = true;
          resolve();
        }
      };

      this._child.stdout!.on("data", onData);
    });
  }

  run(img: string, timeOut: number | undefined = undefined): Promise<string> {
    if (!this._ready) {
      throw "Process is not ready! await waitForSpwan() to be ready";
    }

    if (this._killed) {
      throw "Process is killed!";
    }

    return new Promise((resolve, reject) => {
      let timeoutid: any = undefined;
      if (timeOut) {
        timeoutid = setTimeout(() => {
          clearTimeout(timeoutid);
          reject("time out");
        }, timeOut);
      }

      getRecognitionPromise(img, this._child)
        .then((res) => resolve(res))
        .catch((err) => reject(err))
        .finally(() => clearTimeout(timeoutid));
    });
  }
}

export { PyProc };

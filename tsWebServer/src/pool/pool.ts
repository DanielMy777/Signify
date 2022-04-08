import { PyProc } from "./pyProc/pyProc.js";
import { Task } from "./types.js";
import EventEmitter from "events";

const range = (n: number) => [...Array(n).keys()];
const FREE_WORKER_EVENT = "__worker-free__";

class Pool {
  private _workers: PyProc[];
  private _tasks: Task[] = [];
  private _bus: EventEmitter = new EventEmitter();
  private _timeOut: number | undefined = undefined;

  constructor(
    size: number,
    path: string,
    timeout: number | undefined = undefined
  ) {
    this._workers = range(size).map((i) => new PyProc(i, path));

    this._bus.on(FREE_WORKER_EVENT, (worker_id: number) => {
      const task = this._tasks.shift();
      if (!task) {
        return;
      }

      if (worker_id >= this._workers.length || worker_id < 0) {
        console.log(
          `event with worker_id out of range... worker_id = ${worker_id}`
        );
        return;
      }

      this.runWorker(this._workers[worker_id], task);
    });

    this._timeOut = timeout;
  }

  set timeOut(out: number | undefined) {
    this._timeOut = out;
  }

  get timeOut() {
    return this._timeOut;
  }

  private runWorker(worker: PyProc, task: Task) {
    const { request, img, resolve, reject } = task;
    worker.free = false;
    worker
      .run(request, img)
      .then((res) => resolve(res))
      .catch((err) => reject(err))
      .finally(() => {
        worker.free = true;
        this._bus.emit(FREE_WORKER_EVENT, worker.id);
      });
  }

  workersReady(logFlag: boolean = false): Promise<void> {
    return new Promise(async (resolve, _) => {
      if (logFlag) {
        console.log("waiting for workers to be ready...");
      }

      let counter = 0;
      this._workers.forEach(async (w) => {
        await w.waitForSpwan();
        counter += 1;
        if (logFlag) {
          console.log(`worker ${w.id} ready`);
        }

        if (counter === this._workers.length) {
          resolve();
        }
      });
    });
  }

  destroy(logFlag: boolean = false) {
    if (logFlag) {
      console.log("killing workers...");
    }

    this._workers.forEach((w) => {
      w.kill();
      if (logFlag) {
        console.log(`worker ${w.id} killed`);
      }
    });
  }

  exec(request: string, img: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this._timeOut) {
        setTimeout(() => reject("time out"), this._timeOut);
      }

      const worker = this._workers.find((w) => w.free);
      const task = { request, img, resolve, reject };
      if (worker) {
        this.runWorker(worker, task);
      } else {
        this._tasks.push(task);
      }
    });
  }
}

export { Pool };

import { ChildProcess } from "child_process";

interface ChildWrapper {
  id: number;
  child: ChildProcess;
  busy: boolean;
}

export { ChildWrapper };

import { ChildWrapper } from "./childWrapperType.js";
import child_proccess from "child_process";
const spawn = child_proccess.spawn;

const createChildArray = (
  length: number,
  processName: string
): Array<ChildWrapper> => {
  const arr = [...Array(length).keys()].map((i) => {
    return {
      id: i,
      child: spawn("python", [processName, `${i}`]),
      busy: false,
    };
  });

  return arr;
};

export { createChildArray };

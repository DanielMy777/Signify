import { ChildWrapper } from "./childWrapperType.js";

const clear = (timeOutId: NodeJS.Timer, intervalId: NodeJS.Timer) => {
  clearTimeout(timeOutId);
  clearInterval(intervalId);
};

const getFreeChildWrapper = (
  childPool: Array<ChildWrapper>,
  timeOut: number
): Promise<ChildWrapper> => {
  return new Promise((resolve, reject) => {
    const timeOutId = setTimeout(() => {
      clear(timeOutId, intervalId);
      reject({ error: "timeOut" });
    }, timeOut);

    const intervalId = setInterval(() => {
      const wrapper = childPool.find((wrapper) => wrapper.busy === false);

      if (wrapper) {
        clear(timeOutId, intervalId);
        wrapper.busy = true;
        resolve(wrapper);
      }
    }, 50);
  });
};

export { getFreeChildWrapper };

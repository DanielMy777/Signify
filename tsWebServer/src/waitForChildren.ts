import { ChildWrapper } from "./childWrapperType.js";

const waitForChildren = (wrapperArray: Array<ChildWrapper>): Promise<void> => {
  console.log("waiting for child processes to be ready...");
  return new Promise((resolve, _) => {
    let counter = wrapperArray.length;
    wrapperArray.forEach(({ id, child }) => {
      let readyData = "";
      const onData = (data: string) => {
        readyData += data;
        if (readyData === "ready") {
          console.log(`child ${id} is ready`);
          child.stdout!.removeListener("data", onData);
          counter -= 1;
          if (counter === 0) {
            resolve();
          }
        }
      };
      child.stdout!.on("data", onData);
    });
  });
};

export { waitForChildren };

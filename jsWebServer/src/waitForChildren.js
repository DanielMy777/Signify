const waitForChildren = (wrapperArray) => {
  console.log("waiting for child processes to be ready...");
  return new Promise((resolve, reject) => {
    let counter = wrapperArray.length;
    wrapperArray.forEach(({ id, child, busy }) => {
      let readyData = "";
      const onData = (data) => {
        readyData += data;
        if (readyData === "ready") {
          console.log(`child ${id} is ready`);
          child.stdout.removeListener("data", onData);
          counter -= 1;
          if (counter === 0) {
            resolve();
          }
        }
      };
      child.stdout.on("data", onData);
    });
  });
};

module.exports = { waitForChildren };

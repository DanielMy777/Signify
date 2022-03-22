const clear = (timeOutId, intervalId) => {
  clearTimeout(timeOutId);
  clearInterval(intervalId);
};

const getFreeChildWrapper = (childPool, timeOut) => {
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

module.exports = { getFreeChildWrapper };

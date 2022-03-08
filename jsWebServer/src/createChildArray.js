const child_proccess = require("child_process");
const spawn = child_proccess.spawn;

const createChildArray = (length) => {
  const arr = [...Array(length).keys()].map((i) => {
    return {
      id: i,
      child: spawn("python", ["python_test.py"]),
      busy: false,
    };
  });

  return arr;
};

module.exports = { createChildArray };

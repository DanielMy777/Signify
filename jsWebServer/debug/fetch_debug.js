const fs = require("fs");
const { clearInterval } = require("timers");
const axios = require("axios").default;

const range = (n) => [...Array(n).keys()];

const REQ_NUM = process.argv.length <= 2 ? 20 : parseInt(process.argv[2]);
const USER_NUM = process.argv.length <= 3 ? 1 : parseInt(process.argv[3]);
const PICTURE_PATH =
  process.argv.length <= 4 ? __dirname + "/img_debug.txt" : process.argv[4];

console.log(`REQ_NUM = ${REQ_NUM}, USER_NUM = ${USER_NUM}`);

const base64Hand = fs.readFileSync(PICTURE_PATH).toString();

range(USER_NUM).forEach((i) => {
  let count = 0;
  const id = setInterval(async () => {
    try {
      const res = await axios.post("http://127.0.0.1:3000/api/img", {
        img: base64Hand,
      });
      console.log(res.data);
    } catch (err) {
      console.log("err");
    } finally {
      count += 1;
      if (count === REQ_NUM) {
        clearInterval(id);
      }
    }
  }, 100);
});

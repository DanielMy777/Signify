import fs from "fs";
import { clearInterval } from "timers";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";

const absdir = dirname(fileURLToPath(import.meta.url)); // hack because __dirname isn't defined in modules
const range = (n) => [...Array(n).keys()];

const REQ_NUM = process.argv.length <= 2 ? 20 : parseInt(process.argv[2]);
const USER_NUM = process.argv.length <= 3 ? 1 : parseInt(process.argv[3]);
const PICTURE_PATH =
  process.argv.length <= 4 ? absdir + "/img_debug.txt" : process.argv[4];

console.log(`REQ_NUM = ${REQ_NUM}, USER_NUM = ${USER_NUM}`);

const base64Hand = fs.readFileSync(PICTURE_PATH).toString();

range(USER_NUM).forEach((i) => {
  let count = 0;
  const id = setInterval(async () => {
    try {
      const signifyApi =
        count === 0 || count === REQ_NUM ? "DetectHandsSign" : "DetectHands";
      const res = await axios.post(
        `http://127.0.0.1:3000/api/img/${signifyApi}`,
        {
          img: base64Hand,
        }
      );
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

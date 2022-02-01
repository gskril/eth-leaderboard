import fs from "fs";
import { getTop500Frens } from "./api/db.js";

(async () => {
  const frens = await getTop500Frens();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const year = new Date().getFullYear();
  const fileName = `${month}-${day}-${year}`

  fs.writeFile(
    `./../public/archive/${fileName}.json`,
    JSON.stringify(frens),
    err => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Snapshot saved to /public/archive/${fileName}.json`);
        process.exit();
      }
    }
  );
})();

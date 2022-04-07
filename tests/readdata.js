const fs = require("fs/promises");

fs.readdir("./database/main/").then((d) => {
  d.forEach((f) => {
    fs.readFile(`./database/main/${f}`).then((b) => {
      console.log(`${f} -> ${b.byteLength} bytes`);
    });
  });
});

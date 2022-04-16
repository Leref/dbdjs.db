const fs = require("fs/promises");

console.log("KeyValue")

fs.readdir("./database/main/").then((d) => {
  d.forEach((f) => {
    fs.readFile(`./database/main/${f}`).then((b) => {
      console.log(`${f} -> ${b.byteLength} bytes`);
    });
  });
});

console.log("WideColumn")

fs.readdir("./columndatabase/main/").then((d) => {
  d.forEach((f) => {
    fs.readFile(`./columndatabase/main/${f}`).then((b) => {
      console.log(`${f} -> ${b.byteLength} bytes`);
    });
  });
});
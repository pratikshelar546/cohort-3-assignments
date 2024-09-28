const fs = require("fs");

const readfile = fs.readFileSync("./easy/3-read-from-file.md", "utf-8");

console.log(readfile);

fs.writeFileSync("./easy/3-read-from-file.md", "updated data ", (err) => {
    if (err) throw new err;
    console.log("file saved");

});

const updatedFile = fs.readFileSync("./easy/3-read-from-file.md", "utf-8");
console.log(updatedFile,"upd");

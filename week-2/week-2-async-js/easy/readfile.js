const fs = require('fs');

const readFile = fs.readFile("./easy/3-read-from-file.md", "utf-8", function (err, data) {
    console.log(data);

})

let counter = 0
for (let i = 0; i < 10000000000; i++) {
    counter++

}
console.log(counter);


console.log(readFile);

var fs = require("fs");

var content;

fs.readFile("./a.txt", "utf-8", (err, val) => {
  console.log("val: ", val);
  content = val;
});

console.log("content: ", content);

function barSync(val, callback) {
  callback(val);
}

function barAsycnc(val, callback) {
  setTimeout(() => {
    callback(val);
  }, 0);
}

function myCallback(val) {
  console.log(val);
}

console.log(1);
barSync(2, myCallback);
console.log(3);

console.log("---");
console.log(1);
barAsycnc(2, myCallback);
console.log(3);

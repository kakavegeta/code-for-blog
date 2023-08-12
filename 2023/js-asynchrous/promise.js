const square = new Promise((resolve) => {
  resolve(1);
});

square
  .then((val) => Promise.resolve(val * 2))
  .then((val) => Promise.resolve(val * 2))
  .then((val) => console.log("async...", val))
  .catch((err) => {
    console.log("Error: " + err);
  })
  .finally(() => {
    console.log("promise done");
  });

console.log("sync...", square);

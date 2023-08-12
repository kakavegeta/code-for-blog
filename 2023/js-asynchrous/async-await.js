const num = function (val) {
  return new Promise((resolve) => {
    resolve(val);
  });
};

async function double(val) {
  try {
    let res = await num(val);
    return res * 2;
  } catch (error) {
    throw error;
  }
}

async function seq() {
  try {
    let a = await num(1);
    let b = await num(2);
    let c = await num(3);
    console.log("seq: ", a, b, c);
  } catch (error) {
    throw error;
  }
}
async function concur() {
  try {
    let result = await Promise.all([num(1), num(2), num(3)]);
    console.log("concur: ", result);
  } catch (error) {
    throw error;
  }
}

(async function () {
  let result = await double(5);
  console.log("2 * 5 =", result);
})();

seq();
concur();

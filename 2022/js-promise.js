const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

var Promise = function (executor) {
  let _this = this;
  _this.state = PENDING;
  _this.onFulfilledQueue = [];
  _this.onRejectedQueue = [];
  function resolve(value) {
    if (_this.state === PENDING) {
      _this.state = FULFILLED;
      _this.value = value;
      _this.onFulfilledQueue.forEach((fn) => fn());
    }
  }

  function reject(reason) {
    if (_this.state === PENDING) {
      _this.state = REJECTED;
      _this.reason = reason;
      _this.onRejectedQueue.forEach((fn) => fn());
    }
  }

  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
};

Promise.prototype.then = function (onFulfilled, onRejected) {
  // a. dealing with case: p.then('a').then(1, eor('e')), where onFulfilled & onRejected are not function
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (value) => value;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err;
        };
  var _this = this;
  var promise2 = new Promise((resolve, reject) => {
    if (_this.state === FULFILLED) {
      // b. mimic microtask / async operation
      setTimeout(() => {
        try {
          let x = onFulfilled(_this.value);
          // resolve returned value
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    } else if (_this.state === REJECTED) {
      // mimic microtask / async operation
      setTimeout(() => {
        try {
          let x = onRejected(_this.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    } else if (_this.state === PENDING) {
      // c. push unexcuted tasks to onFulfilled/onRejected queue.
      // setTimeout mimic microtask
      _this.onFulfilledQueue.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(_this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
      _this.onRejectedQueue.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(_this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      });
    }
  });
  return promise2;
};

var resolvePromise = function (promise2, x, resolve, reject) {
  if (promise2 === x) {
    reject(new TypeError("Loop Chaining!"));
    return;
  }

  if (x && (typeof x === "object" || typeof x === "function")) {
    let flag = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (flag) return;
            resolvePromise(promise2, y, resolve, reject);
            flag = true;
          },
          (r) => {
            if (flag) return;
            reject(r);
            flag = true;
          },
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (flag) return;
      reject(e);
      flag = true;
    }
  } else {
    resolve(x);
  }
};

module.exports = Promise;

Promise.defer = Prmise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
};

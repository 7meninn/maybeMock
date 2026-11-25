// =============================================================
//  POLYFILLS: SOLUTIONS (spoiler!)
//  Pehle khud polyfills.js mein try karo. Ye file sirf check karne ke liye hai.
//  Isi test suite ko solutions pe chalao:
//    SOLUTIONS=1 node --test practice/polyfills/polyfills.test.js
// =============================================================

// ---------- 1. Function: call / apply / bind ----------

// fn.myCall(thisArg, ...args)
Function.prototype.myCall = function (thisArg, ...args) {
  thisArg = (!thisArg) ? globalThis : thisArg;
  const functionToRun = this;
  const uniqueKey = Symbol()
  thisArg[uniqueKey] = functionToRun;
  const result = thisArg[uniqueKey](...args);
  delete thisArg[uniqueKey];
  return result;
};

// fn.myApply(thisArg, argsArray)
Function.prototype.myApply = function (thisArg, argsArray = []) {
  if (!Array.isArray(argsArray)) throw new Error("Arguements needs to be a array object.")
  const functionToRun = this;
  thisArg = (!thisArg) ? globalThis : thisArg;
  const uniqueKey = Symbol()
  thisArg[uniqueKey] = functionToRun;
  const result = thisArg[uniqueKey](...argsArray);
  delete thisArg[uniqueKey];
  return result;
};

// fn.myBind(thisArg, ...presetArgs) -> new function (partial application bhi support karo)
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  const functionToRun = this;
  thisArg = (!thisArg) ? globalThis : Object(thisArg);
  const uniqueKey = Symbol();
  thisArg[uniqueKey] = functionToRun;
  const newFunction = function (...restOfArgs) {
    const result = thisArg[uniqueKey](...presetArgs, ...restOfArgs);
    delete thisArg[uniqueKey];
    return result;
  }
  return newFunction;
};

// ---------- 2. Array: map / filter / reduce ----------

// callback(element, index, array)
Array.prototype.myMap = function (callback, thisArg) {
  const newArr = []
  for (let i = 0; i < this.length; i++) {
    let element = this[i];
    newArr.push(callback(element, i, this));
  }
  return newArr;
};

Array.prototype.myFilter = function (callback, thisArg) {
  const resultantArr = []
  for (let i = 0; i < this.length; i++) {
    const element = this[i];
    if (callback(element)) resultantArr.push(element);
  }
  return resultantArr;
};

// initialValue na ho to pehla element accumulator banta hai.
// Empty array + no initialValue -> TypeError throw karo (native jaisa).
Array.prototype.myReduce = function (callback, initialValue) {
  if (this.length == 0 && initialValue == undefined) throw new TypeError("Initial Value Not Given for an Empty Array")
  if (this.length == 0) return initialValue;
  let accumulate = initialValue;
  let i = 0;
  if (initialValue == undefined) {
    accumulate = this[0];
    i++;
  }
  for (i; i < this.length; i++) accumulate = callback(accumulate, this[i]);
  return accumulate;
};

// ---------- 3. Closures ----------

// fn sirf pehli baar chale; baad ki calls pehla result hi return karein.
function once(fn) {
  let called = false;
  let result = 0;
  return function (...args) {
    if (!called) {
      called = true;
      return result = fn(...args)
    };
    return result;
  }
}

// Same arguments -> cached result (fn dobara call nahi hona chahiye).
function memoize(fn) {
  const mp = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (mp.has(key)) return mp.get(key);
    mp.set(key, fn(...args));
    return mp.get(key);
  }
}

// curry(fn) -> curried(1)(2)(3), curried(1, 2)(3), curried(1)(2, 3) sab kaam karein.
// Hint: fn.length = expected arguments ki count.
function curry(fn) {
  const argsReq = fn.length;
  return function curried(...args) {
    if (args.length >= argsReq) return fn(...args);
    return function (...newArgs) {
      return curried(...args, ...newArgs);
    }
  }
}

// ---------- 4. Timers ----------?

// Trailing debounce: last call ke `wait` ms baad fn chale, last args + `this` ke saath.
function debounce(fn, wait) {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => { fn.apply(context, args) }, wait);
  }
}

// Leading throttle: pehli call turant chale, phir `wait` ms tak baaki calls ignore.
function throttle(fn, wait) {
  let isRunning = false;
  return (...args) => {
    if (isRunning) return;
    isRunning = true
    setTimeout(() => {
      isRunning = false
    }, wait);
    return fn(...args)
  }
}

// ---------- 5. Objects / arrays ----------

// Nested objects, arrays aur Date ka deep copy. (Bonus: circular references.)
function deepClone(value, visited = new WeakMap()) {
  if (value == null || typeof value !== "object") return value;
  if (visited.has(value)) return visited.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) {
    const clonedArr = []
    visited.set(value, clonedArr);
    for (let i = 0; i < value.length; i++) clonedArr[i] = deepClone(value[i], visited);
    return clonedArr;
  }
  const clonedObj = {};
  visited.set(value, clonedObj);
  for (const key in value) if (Object.prototype.hasOwnProperty.call(value, key)) clonedObj[key] = deepClone(value[key], visited)
  return clonedObj;
}

// flatten([1, [2, [3, [4]]]], 1) -> [1, 2, [3, [4]]]; default depth = Infinity
function flatten(arr, depth = Infinity) {
  const result = [];
  for (let val of arr) {
    if (Array.isArray(val) && depth > 0) result.push(...flatten(val, depth - 1));
    else result.push(val)
  }
  return result;
}

// ---------- 6. Promises ----------

// Order preserve karo, non-promise values allow karo, pehle reject pe reject.
function promiseAll(items) {
  return new Promise((resolve, reject) => {
    const results = new Array(items.length)
    let completed = 0;
    if (items.length == 0) { resolve([]); return; }
    items.forEach((element, index) => {
      Promise.resolve(element)
        .then((value) => {
          completed++;
          results[index] = value;
          if (completed == items.length) resolve(results);
        })
        .catch(reject)
    });
  })
}

// Har item -> { status: "fulfilled", value } ya { status: "rejected", reason }
function promiseAllSettled(items) {
  return new Promise((resolve) => {
    const results = new Array(items.length);
    let completed = 0;
    if (items.length === 0) {
      resolve([]);
      return;
    }
    items.forEach((item, index) => {
      Promise.resolve(item)
        .then((value) => {
          results[index] = {
            status: "fulfilled",
            value
          };
        })
        .catch((reason) => {
          results[index] = {
            status: "rejected",
            reason
          };
        })
        .finally(() => {
          completed++;
          if (completed == items.length) resolve(results);
        })
    })
  })
}

// Pehla fulfilled value; sab reject ho jayein to AggregateError.
function promiseAny(items) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let rejectedCount = 0;
    let total = items.length;
    if (total === 0) {
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }
    items.forEach((item) => {
      Promise.resolve(item)
        .then((value) => {
          resolve(value);
        })
        .catch((reason) => {
          errors.push(reason);
          rejectedCount++;
          if (rejectedCount == total) reject(new AggregateError(errors, "All promises were rejected"))
        })
    })
  })
}

// Jo pehle settle ho (resolve ya reject), wahi result.
function promiseRace(items) {
  return new Promise((resolve, reject) => {
    if (items.length == 0) {
      reject("No promise to process.")
      return;
    }
    items.forEach((item) => {
      Promise.resolve(item)
        .then(resolve)
        .catch(reject)
    })
  })
}

// Node-style callback fn(...args, (err, value) => {}) ko promise-returning fn banao.
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) =>{ 
      fn(...args, (err, value) => {
        if (err) reject(err)
        else resolve(value)
      })
    })
  }
}

// ---------- 7. EventEmitter ----------

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  off(event, listener) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(item => item !== listener)
  }

  // listener sirf ek baar chale
  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    }
    this.on(event, wrapper);
  }

  // saare listeners ko args ke saath call karo; listeners the to true, warna false
  emit(event, ...args) {
    if (!this.events[event]?.length) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }
}

module.exports = {
  once,
  memoize,
  curry,
  debounce,
  throttle,
  deepClone,
  flatten,
  promiseAll,
  promiseAllSettled,
  promiseAny,
  promiseRace,
  promisify,
  EventEmitter,
};

// =============================================================
//  POLYFILLS PRACTICE
//  Har function ka body khud likho. Stub sirf "Not implemented" throw karta hai.
//  Test chalao:   node --test practice/polyfills/polyfills.test.js
//  Ek hi topic:   node --test --test-name-pattern="myBind" practice/polyfills/polyfills.test.js
// =============================================================

const todo = (name) => {
  throw new Error(`${name}: Not implemented`);
};

// ---------- 1. Function: call / apply / bind ----------

// fn.myCall(thisArg, ...args)
Function.prototype.myCall = function (thisArg, ...args) {
  todo("myCall");
};

// fn.myApply(thisArg, argsArray)
Function.prototype.myApply = function (thisArg, argsArray) {
  todo("myApply");
};

// fn.myBind(thisArg, ...presetArgs) -> new function (partial application bhi support karo)
Function.prototype.myBind = function (thisArg, ...presetArgs) {
  todo("myBind");
};

// ---------- 2. Array: map / filter / reduce ----------

// callback(element, index, array)
Array.prototype.myMap = function (callback, thisArg) {
  todo("myMap");
};

Array.prototype.myFilter = function (callback, thisArg) {
  todo("myFilter");
};

// initialValue na ho to pehla element accumulator banta hai.
// Empty array + no initialValue -> TypeError throw karo (native jaisa).
Array.prototype.myReduce = function (callback, initialValue) {
  todo("myReduce");
};

// ---------- 3. Closures ----------

// fn sirf pehli baar chale; baad ki calls pehla result hi return karein.
function once(fn) {
  todo("once");
}

// Same arguments -> cached result (fn dobara call nahi hona chahiye).
function memoize(fn) {
  todo("memoize");
}

// curry(fn) -> curried(1)(2)(3), curried(1, 2)(3), curried(1)(2, 3) sab kaam karein.
// Hint: fn.length = expected arguments ki count.
function curry(fn) {
  todo("curry");
}

// ---------- 4. Timers ----------

// Trailing debounce: last call ke `wait` ms baad fn chale, last args + `this` ke saath.
function debounce(fn, wait) {
  todo("debounce");
}

// Leading throttle: pehli call turant chale, phir `wait` ms tak baaki calls ignore.
function throttle(fn, wait) {
  todo("throttle");
}

// ---------- 5. Objects / arrays ----------

// Nested objects, arrays aur Date ka deep copy. (Bonus: circular references.)
function deepClone(value) {
  todo("deepClone");
}

// flatten([1, [2, [3, [4]]]], 1) -> [1, 2, [3, [4]]]; default depth = Infinity
function flatten(arr, depth = Infinity) {
  todo("flatten");
}

// ---------- 6. Promises ----------

// Order preserve karo, non-promise values allow karo, pehle reject pe reject.
function promiseAll(items) {
  todo("promiseAll");
}

// Har item -> { status: "fulfilled", value } ya { status: "rejected", reason }
function promiseAllSettled(items) {
  todo("promiseAllSettled");
}

// Pehla fulfilled value; sab reject ho jayein to AggregateError.
function promiseAny(items) {
  todo("promiseAny");
}

// Jo pehle settle ho (resolve ya reject), wahi result.
function promiseRace(items) {
  todo("promiseRace");
}

// Node-style callback fn(...args, (err, value) => {}) ko promise-returning fn banao.
function promisify(fn) {
  todo("promisify");
}

// ---------- 7. EventEmitter ----------

class EventEmitter {
  on(event, listener) {
    todo("EventEmitter.on");
  }

  off(event, listener) {
    todo("EventEmitter.off");
  }

  // listener sirf ek baar chale
  once(event, listener) {
    todo("EventEmitter.once");
  }

  // saare listeners ko args ke saath call karo; listeners the to true, warna false
  emit(event, ...args) {
    todo("EventEmitter.emit");
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

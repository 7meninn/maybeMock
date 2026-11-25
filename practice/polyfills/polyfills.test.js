const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const {
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
} = require("./polyfills");

const delay = (ms, value, fail = false) =>
  new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(value) : resolve(value)), ms)
  );

describe("myCall / myApply / myBind", () => {
  function greet(greeting, punct) {
    return `${greeting}, ${this.name}${punct}`;
  }
  const user = { name: "Bimal" };

  test("myCall sets this and passes args", () => {
    assert.equal(greet.myCall(user, "Hi", "!"), "Hi, Bimal!");
  });

  test("myCall does not leave extra keys on thisArg", () => {
    const obj = { name: "X" };
    greet.myCall(obj, "Yo", ".");
    assert.deepEqual(Object.keys(obj), ["name"]);
  });

  test("myApply takes args array", () => {
    assert.equal(greet.myApply(user, ["Hello", "?"]), "Hello, Bimal?");
  });

  test("myApply works without args array", () => {
    function getName() {
      return this.name;
    }
    assert.equal(getName.myApply(user), "Bimal");
  });

  test("myBind returns a bound function", () => {
    const bound = greet.myBind(user, "Hey");
    assert.equal(typeof bound, "function");
    assert.equal(bound("!!"), "Hey, Bimal!!");
  });

  test("myBind keeps this even when called as a method of another object", () => {
    const bound = greet.myBind(user, "Hey", ".");
    const other = { name: "Other", bound };
    assert.equal(other.bound(), "Hey, Bimal.");
  });
});

describe("myMap / myFilter / myReduce", () => {
  test("myMap passes element, index, array", () => {
    const arr = [10, 20, 30];
    assert.deepEqual(
      arr.myMap((x, i, a) => x + i + a.length),
      [13, 24, 35]
    );
  });

  test("myMap does not mutate original", () => {
    const arr = [1, 2, 3];
    arr.myMap((x) => x * 2);
    assert.deepEqual(arr, [1, 2, 3]);
  });

  test("myFilter keeps truthy results", () => {
    assert.deepEqual(
      [1, 2, 3, 4, 5, 6].myFilter((x) => x % 2 === 0),
      [2, 4, 6]
    );
  });

  test("myReduce with initial value", () => {
    assert.equal([1, 2, 3].myReduce((acc, x) => acc + x, 10), 16);
  });

  test("myReduce without initial value uses first element", () => {
    assert.equal([1, 2, 3, 4].myReduce((acc, x) => acc * x), 24);
  });

  test("myReduce builds an object (real-world grouping)", () => {
    const words = ["apple", "avocado", "banana"];
    const grouped = words.myReduce((acc, w) => {
      (acc[w[0]] ||= []).push(w);
      return acc;
    }, {});
    assert.deepEqual(grouped, { a: ["apple", "avocado"], b: ["banana"] });
  });

  test("myReduce on empty array without initial value throws TypeError", () => {
    assert.throws(() => [].myReduce((a, b) => a + b), TypeError);
  });
});

describe("once / memoize / curry", () => {
  test("once runs fn only one time and caches result", () => {
    let calls = 0;
    const init = once((x) => {
      calls++;
      return x * 2;
    });
    assert.equal(init(5), 10);
    assert.equal(init(100), 10);
    assert.equal(calls, 1);
  });

  test("memoize caches by arguments", () => {
    let calls = 0;
    const slowAdd = memoize((a, b) => {
      calls++;
      return a + b;
    });
    assert.equal(slowAdd(2, 3), 5);
    assert.equal(slowAdd(2, 3), 5);
    assert.equal(calls, 1);
    assert.equal(slowAdd(3, 2), 5);
    assert.equal(calls, 2);
  });

  test("curry supports all call shapes", () => {
    const sum3 = curry((a, b, c) => a + b + c);
    assert.equal(sum3(1)(2)(3), 6);
    assert.equal(sum3(1, 2)(3), 6);
    assert.equal(sum3(1)(2, 3), 6);
    assert.equal(sum3(1, 2, 3), 6);
  });

  test("curried partials are reusable", () => {
    const sum3 = curry((a, b, c) => a + b + c);
    const add10 = sum3(10);
    assert.equal(add10(1)(1), 12);
    assert.equal(add10(5, 5), 20);
  });
});

describe("debounce / throttle", () => {
  test("debounce calls once with last args after wait", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const calls = [];
    const search = debounce((q) => calls.push(q), 300);
    search("r");
    search("re");
    search("rea");
    t.mock.timers.tick(299);
    assert.deepEqual(calls, []);
    t.mock.timers.tick(1);
    assert.deepEqual(calls, ["rea"]);
  });

  test("debounce preserves this", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const obj = {
      name: "box",
      seen: null,
      save: debounce(function () {
        this.seen = this.name;
      }, 100),
    };
    obj.save();
    t.mock.timers.tick(100);
    assert.equal(obj.seen, "box");
  });

  test("throttle runs at most once per wait (leading)", (t) => {
    t.mock.timers.enable({ apis: ["setTimeout", "Date"] });
    let calls = 0;
    const onScroll = throttle(() => calls++, 100);
    onScroll();
    onScroll();
    assert.equal(calls, 1);
    t.mock.timers.tick(50);
    onScroll();
    assert.equal(calls, 1);
    t.mock.timers.tick(60);
    onScroll();
    assert.equal(calls, 2);
  });
});

describe("deepClone / flatten", () => {
  test("deepClone copies nested objects and arrays", () => {
    const original = { a: 1, b: { c: [1, 2, { d: 3 }] } };
    const copy = deepClone(original);
    assert.deepEqual(copy, original);
    copy.b.c[2].d = 99;
    copy.b.c.push(4);
    assert.equal(original.b.c[2].d, 3);
    assert.equal(original.b.c.length, 3);
  });

  test("deepClone keeps arrays as arrays and copies Date", () => {
    const original = { list: [1, 2], when: new Date("2024-01-01") };
    const copy = deepClone(original);
    assert.ok(Array.isArray(copy.list));
    assert.ok(copy.when instanceof Date);
    assert.notEqual(copy.when, original.when);
    assert.equal(copy.when.getTime(), original.when.getTime());
  });

  test("deepClone returns primitives and null as-is", () => {
    assert.equal(deepClone(5), 5);
    assert.equal(deepClone("x"), "x");
    assert.equal(deepClone(null), null);
  });

  test("flatten fully by default", () => {
    assert.deepEqual(flatten([1, [2, [3, [4, [5]]]]]), [1, 2, 3, 4, 5]);
  });

  test("flatten respects depth", () => {
    assert.deepEqual(flatten([1, [2, [3, [4]]]], 1), [1, 2, [3, [4]]]);
    assert.deepEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
  });
});

describe("promiseAll / allSettled / any / race", () => {
  test("promiseAll keeps input order, not finish order", async () => {
    const result = await promiseAll([delay(30, "a"), delay(10, "b"), "c"]);
    assert.deepEqual(result, ["a", "b", "c"]);
  });

  test("promiseAll of empty array resolves []", async () => {
    assert.deepEqual(await promiseAll([]), []);
  });

  test("promiseAll rejects on first rejection", async () => {
    await assert.rejects(
      promiseAll([delay(50, "a"), delay(10, new Error("boom"), true)]),
      { message: "boom" }
    );
  });

  test("promiseAllSettled reports every result", async () => {
    const result = await promiseAllSettled([
      delay(10, 1),
      delay(5, "err", true),
      3,
    ]);
    assert.deepEqual(result, [
      { status: "fulfilled", value: 1 },
      { status: "rejected", reason: "err" },
      { status: "fulfilled", value: 3 },
    ]);
  });

  test("promiseAny resolves with first fulfilled", async () => {
    const result = await promiseAny([
      delay(5, "x", true),
      delay(20, "slow"),
      delay(10, "fast"),
    ]);
    assert.equal(result, "fast");
  });

  test("promiseAny rejects with AggregateError if all fail", async () => {
    await assert.rejects(
      promiseAny([delay(5, "a", true), delay(10, "b", true)]),
      (err) => err instanceof AggregateError && err.errors.length === 2
    );
  });

  test("promiseRace settles with the first one (resolve)", async () => {
    assert.equal(await promiseRace([delay(20, "slow"), delay(5, "fast")]), "fast");
  });

  test("promiseRace settles with the first one (reject)", async () => {
    await assert.rejects(
      promiseRace([delay(20, "slow"), delay(5, new Error("fail"), true)]),
      { message: "fail" }
    );
  });
});

describe("promisify", () => {
  function readConfig(name, cb) {
    setTimeout(() => {
      if (name === "missing") cb(new Error("ENOENT"));
      else cb(null, { name, port: 3000 });
    }, 5);
  }

  test("resolves with callback value", async () => {
    const read = promisify(readConfig);
    assert.deepEqual(await read("app"), { name: "app", port: 3000 });
  });

  test("rejects with callback error", async () => {
    const read = promisify(readConfig);
    await assert.rejects(read("missing"), { message: "ENOENT" });
  });
});

describe("EventEmitter", () => {
  test("on + emit passes args to all listeners", () => {
    const em = new EventEmitter();
    const got = [];
    em.on("order", (id, amt) => got.push(`a:${id}:${amt}`));
    em.on("order", (id) => got.push(`b:${id}`));
    assert.equal(em.emit("order", 7, 500), true);
    assert.deepEqual(got, ["a:7:500", "b:7"]);
  });

  test("emit returns false when no listeners", () => {
    assert.equal(new EventEmitter().emit("nothing"), false);
  });

  test("off removes a listener", () => {
    const em = new EventEmitter();
    let count = 0;
    const handler = () => count++;
    em.on("tick", handler);
    em.emit("tick");
    em.off("tick", handler);
    em.emit("tick");
    assert.equal(count, 1);
  });

  test("once runs a single time", () => {
    const em = new EventEmitter();
    let count = 0;
    em.once("ready", () => count++);
    em.emit("ready");
    em.emit("ready");
    assert.equal(count, 1);
  });
});

# Mistakes Log (GC se pehle ye file zaroor revise karni hai)

## Day 1: JS core, Round 1 (hoisting, scope, coercion): 5.75 / 8

### ❌ Block scope + TDZ (shadowing)
```js
let x = 1;
{ console.log(x); let x = 2; }   // ReferenceError, 1 NAHI
```
Block ke andar `let x` **poore block** ke liye hoist hota hai aur bahar wale `x` ko shadow kar deta hai. Line 1 tak wo TDZ mein hai, isliye ReferenceError aata hai. JS ye nahi dekhta ki "abhi tak declare nahi hua to bahar wala le lo".

### ❌ `[] == false` → `true`
Loose equality mein dono taraf **number** mein convert hote hain: `[]` → `""` → `0`, aur `false` → `0`, to `0 == 0` → `true`.
Par `if ([])` phir bhi chalta hai, kyunki truthiness check mein conversion nahi hota, wahan object hamesha truthy hai. Isiliye `===` use karo.

### ❌ `&&` / `||` / `??` kya return karte hain
Ye boolean nahi, **operand khud** return karte hain:
- `a || b` → pehla **truthy** value, warna last value
- `a && b` → pehla **falsy** value, warna last value
- `a ?? b` → `a`, jab tak wo `null`/`undefined` na ho
```js
"" && "hello"   // ""
"hi" && "hello" // "hello"
0 || "default"  // "default"
0 ?? "default"  // 0
```
Real use: `user && user.name` (guard), `count ?? 10` (jab 0 bhi valid value ho).

### ⚠️ Falsy values: poori list (8)
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`.
Inke alawa sab truthy hai, jaise `[]`, `{}`, `"0"`, `"false"`.

### ⚠️ Precise wording
- `var`: hoist hota hai **aur `undefined` se initialize** bhi ho jata hai. `let`/`const` hoist hote hain par uninitialized rehte hain (TDZ).
- `NaN === NaN` → `false`. Ye bug nahi hai, IEEE-754 spec yahi kehta hai. Check ke liye `Number.isNaN(x)` ya `Object.is(x, NaN)` use karo.
- `const` ka matlab hai ki **binding reassign nahi ho sakti** (primitive ho ya object, dono pe). Object ke andar ka data mutate ho sakta hai. Use rokna ho to `Object.freeze` (sirf shallow).

## Day 1: JS core, Round 2 (closures, `this`): 4 / 8

### ❌ Method ko variable mein nikaalne se `this` kho jata hai
```js
const fn = obj.regular;  // regular() { return this.name }
fn();  // strict mode: this = undefined → TypeError (undefined nahi!)
```
Non-strict mode mein `this` = globalThis hota hai, aur result `undefined` aata hai. Par class/ESM mein default strict mode hai, isliye crash. Fix: `obj.regular.bind(obj)`.

### ❌ `bind` hard binding hai, dobara nahi badalti
```js
const a = show.bind({x:1});
a.bind({x:2})();     // 1
a.call({x:3});       // 1
```
Pehla `bind` jeet jata hai. Uske baad `bind`/`call`/`apply` us `this` ko nahi badal sakte. Sirf `new` override kar sakta hai.

### ❌ `var` loop + setTimeout ko 0 1 2 print karwana
```js
// 1. IIFE: har iteration ka apna scope
for (var i = 0; i < 3; i++) ((j) => setTimeout(() => console.log(j), 0))(i);
// 2. setTimeout ka 3rd argument callback ko pass hota hai
for (var i = 0; i < 3; i++) setTimeout((j) => console.log(j), 0, i);
// 3. bind
for (var i = 0; i < 3; i++) setTimeout(console.log.bind(null, i), 0);
```

### ⚠️ Closure: interview wali definition
"Closure = function + uska lexical environment. Function apne bahar ke variables **yaad rakhta hai, outer function return hone ke baad bhi**."
Use cases: data privacy (counter, module pattern, `#private` se pehle), `once`/`memoize`/`debounce` (timer id closure mein), function factories (`multiplyBy(2)`), event handlers.
Gotcha: closure badi cheezein pakde rahe to memory leak ho sakta hai, jaise listener ko remove na karna.

### ⚠️ `new` ke 4 steps (order matter karta hai)
1. Naya khaali object banta hai
2. Uska `[[Prototype]]` = `Constructor.prototype`
3. Constructor `this` = wo object leke chalta hai
4. Wo object return hota hai, **jab tak constructor khud koi object return na kare**

### ❌ `this` ke 4 rules (priority high → low)
1. **`new`** → naya object
2. **Explicit**: `call`/`apply`/`bind` → diya hua object (bind hard hai)
3. **Implicit**: `obj.method()` → dot se pehle wala object
4. **Default**: plain call `fn()` → strict mein `undefined`, warna `globalThis`

**Arrow function**: iska apna `this` hota hi nahi. Ye lexical hai, yaani jahan likha gaya wahan ka `this`. `call`/`bind`/`new` kuch nahi badal sakte, aur `new` lagao to TypeError aata hai.

## Day 1: JS core, Round 3 (event loop, promises): 5 / 8

### ❌ `.catch` ke baad chain **chalti rehti hai**
```js
.then(() => { throw new Error("boom") })
.then(() => console.log("never"))         // skip
.catch(e => { console.log(e.message); return 10; })  // "boom"
.then(x => console.log(x))                // 10 ✅ chalega
.finally(() => console.log("done"))       // "done"
```
`catch` error ko **handle** karke ek naya resolved promise deta hai (jo bhi return kiya, wahi value). Isliye uske baad wale `then` chalte hain. `then` ki return value tabhi print hogi jab koi use `console.log` kare (`2` kabhi print nahi hua).
`finally` ko koi argument nahi milta, aur ye value ko pass-through kar deta hai.

### ❌ `resolve()` function ko rokta nahi
```js
new Promise(res => { console.log("exec"); res("ok"); res("again"); console.log("after resolve"); })
// exec → after resolve → sync → ok
```
Executor **synchronously** chalta hai. `resolve` sirf state set karta hai, `return` nahi karta. Pehla `resolve` jeet jata hai, baaki ignore hote hain.

### ⚠️ try/catch sirf `await` kiye gaye promise ko pakadta hai
`Promise.reject()` bina `await` ke chalaoge to try/catch se bahar nikal jayega. Node 15+ mein ye **unhandled rejection → process crash** hai. Fix: `await Promise.reject(...)` (ya `return await`).

### ❌ `forEach` async ka wait nahi karta
```js
[1,2,3].forEach(async id => { await delay(100); console.log(id); });
console.log("done");   // "done" TURANT, phir ~100ms baad 1 2 3 ek saath
```
```js
for (const id of ids) await fetchUser(id);           // sequential (~300ms)
await Promise.all(ids.map(id => fetchUser(id)));     // parallel (~100ms)
```

### ⚠️ Theory card (interview mein bol ke batana padega)
- **Microtask**: `.then/catch/finally`, `await` ke baad ka code, `queueMicrotask`, `MutationObserver`. **Macrotask**: `setTimeout`, `setInterval`, I/O, UI events, `setImmediate` (Node).
- Order: poora sync code → **saare** microtasks (beech mein naye microtask bane to wo bhi) → **ek** macrotask → phir se saare microtasks → …
- `all`: sab pass hone chahiye, pehla reject aate hi fail (dashboard jahan sab data zaroori ho). `allSettled`: kabhi reject nahi hota, sabka status deta hai (bulk email ya partial dashboard). `any`: pehla success, sab fail hon to `AggregateError` (multiple CDN/mirror). `race`: pehla jo settle ho, chahe pass ya fail (timeout lagana).

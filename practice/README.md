# Practice

Node ke built-in test runner se chalta hai. Kuch install nahi karna. Commands project root (`maybeMock/`) se chalao.

## Polyfills
`polyfills/polyfills.js` mein stubs bhare hain, code tumhe likhna hai.
```bash
node --test practice/polyfills/polyfills.test.js
```
Sirf ek topic ke tests:
```bash
node --test --test-name-pattern="myBind" practice/polyfills/polyfills.test.js
```
Atak jao ya apna answer compare karna ho, to `polyfills/polyfills.solutions.js` dekho (spoiler, pehle khud try karna). Same tests solutions pe chalane ke liye:
```bash
SOLUTIONS=1 node --test practice/polyfills/polyfills.test.js
```

## Tasks
Har task ke folder mein `README.md` (spec), `solution.js` (tumhara code) aur `solution.test.js` hain.
```bash
node --test practice/tasks/T01-order-report/solution.test.js
```
Saare tests ek saath:
```bash
node --test "practice/**/*.test.js"
```

## Rules (interview jaisa)
1. Pehle README poora padho, edge cases khud socho
2. 20–30 min ka timer lagao, bina AI/Google ke
3. Tests green ho jayein, to mujhe code dikhao. Main review aur cross-questions karunga
4. Readme ke "Discussion questions" ka jawab bolke practice karo

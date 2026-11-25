# Interview Prep: Practice-First Plan (JS Fullstack + React, L1 + L2)

**Deadline:** 2 Dec 2026 (7 din bache hain, aaj 25 Nov se)
**Approach:** Theory alag se nahi padhni. **Code likhte hue concept test hoga.** Jahan atke, wahi concept 10 min mein mujhse samjho, aur phir wapas code pe lag jao.
**Source:** `View Template.mhtml` (EPAM JS FullStack React template). Sirf interview-important L1/L2 topics.

---

## Har din ke 4 tracks (JS ke liye)

| Track | Kya | Kahan |
|---|---|---|
| **A. Polyfills** | `bind`, `map`, `reduce`, `Promise.all`, `debounce`, `curry`, `deepClone`, `EventEmitter`… | `practice/polyfills/` (39 tests) |
| **B. Real-world tasks** | Data processing, pagination, async loading, mentor ke expense-dashboard jaisi tasks | `practice/tasks/` (T01–T03 ready, aur aate rahenge) |
| **C. LeetCode "30 Days of JavaScript"** | JS-specific problems (closures, promises, timers, prototypes). Seedha polyfill-type questions hain | leetcode.com/studyplan/30-days-of-javascript |
| **D. DSA in JS** | Arrays/strings/hashmap patterns, interview ke common problems | LeetCode (list neeche) |

**Daily loop:** problem try karo (15–25 min, bina AI ke) → tests chalao → mujhe code dikhao → main review + cross-questions karunga ("ye `this` kyun undefined hua?") → concept wahin clear ho jayega.

---

## 7-day plan

### Day 1 (25 Nov): Closures, `this`, functions
- [ ] Polyfills: `myCall`, `myApply`, `myBind`, `once`, `memoize`, `curry`
- [ ] LC 30 Days: 2667, 2620, 2704, 2665, 2629, 2703, 2666, 2623
- [ ] DSA: 1 Two Sum, 217 Contains Duplicate, 242 Valid Anagram
- [ ] Concepts jo test honge: hoisting/TDZ, scope, `this` ke 4 rules, closures, `==` vs `===`/coercion
- [ ] Task: **T01 Order Report**

### Day 2 (26 Nov): Arrays + objects
- [ ] Polyfills: `myMap`, `myFilter`, `myReduce`, `deepClone`, `flatten`
- [ ] LC 30 Days: 2635, 2634, 2626, 2677, 2619, 2631, 2724, 2722, 2625, 2705, 2727
- [ ] DSA: 49 Group Anagrams, 347 Top K Frequent, 238 Product Except Self, 283 Move Zeroes, 26 Remove Duplicates
- [ ] Concepts: shallow vs deep copy, pass by reference, for…in vs for…of, destructuring/spread/rest, property descriptors
- [ ] Task: **T02 User Directory** + mentor wali Expense Dashboard task

### Day 3 (27 Nov): Async JS + event loop (mentor ka favourite area)
- [ ] Polyfills: `promiseAll`, `promiseAllSettled`, `promiseAny`, `promiseRace`, `promisify`, `debounce`, `throttle`
- [ ] LC 30 Days: 2723, 2621, 2715, 2725, 2637, 2622, 2627, 2721
- [ ] DSA: 20 Valid Parentheses, 125 Valid Palindrome, 121 Best Time to Buy/Sell Stock
- [ ] Concepts: event loop output questions (microtask vs macrotask), callback hell, async error handling, custom errors
- [ ] Task: **T03 Dashboard Loader**

### Day 4 (28 Nov): OOP, prototypes, TypeScript
- [ ] Polyfills: `EventEmitter`, calculator with method chaining
- [ ] LC 30 Days: 2694 Event Emitter, 2695 Array Wrapper, 2726 Calculator with Method Chaining
- [ ] DSA: 3 Longest Substring w/o Repeating, 15 3Sum, 704 Binary Search, 206 Reverse Linked List
- [ ] Concepts: prototype chain, class vs constructor fn, `extends`/`super`, static/private, getters/setters
- [ ] TS (sirf important): types vs interfaces, unions, generics, `Partial`/`Omit`/`ReturnType`, access modifiers, abstract class. Practice: purane polyfills/tasks ko TS mein convert karo
- [ ] Task: T04 (main dunga)

### Day 5 (29 Nov): Browser + React I
- [ ] DOM quick: event delegation, bubbling, `fetch`, debounced search (vanilla JS mini task)
- [ ] CSS quick: box model, flexbox, positioning, media queries (sirf interview Q&A level)
- [ ] React build: **Task Manager** (state, props, lists + keys, controlled form, `useEffect` fetch, lifting state up)
- [ ] Concepts: re-render kab hota hai, Virtual DOM, controlled vs uncontrolled

### Day 6 (30 Nov): React II
- [ ] Same app mein add karo: React Router (`/tasks`, `/tasks/:id`, `/tasks/new`), Context ya Redux Toolkit, custom hooks (`useFetch`, `useDebounce`), `React.memo`/`useCallback`/`useMemo` sahi jagah
- [ ] Concepts: HOC, render props, refs, Context vs Redux, Redux flow + thunk

### Day 7 (1 Dec): Node + Express + DB + mock
- [ ] Express API for Task Manager: CRUD routes, validation + logger + error middleware, JWT-protected route, MVC structure
- [ ] Node Q&A: CommonJS vs ESM, npm/semver/package-lock, `fs` sync vs async, `EventEmitter`, streams (idea), Node event loop
- [ ] **PostgreSQL vs MongoDB** (difference only, apne project ke example se)
- [ ] Git Q&A: rebase vs merge, revert vs reset, cherry-pick, conflicts, branching strategy
- [ ] **Full mock interview** with me (JS + polyfill + task + React + Node)

### 2 Dec: Interview day 💪
Subah sirf polyfills ek baar dobara likho (bina dekhe) aur weak notes revise karo.

---

## DSA bonus list (time mile to)
88 Merge Sorted Array · 169 Majority Element · 14 Longest Common Prefix · 53 Maximum Subarray · 70 Climbing Stairs · 21 Merge Two Sorted Lists · 141 Linked List Cycle · 56 Merge Intervals · 11 Container With Most Water · 739 Daily Temperatures

## Boot.dev
Ab main track nahi hai. Kisi concept pe atko to Boot.dev Learn JavaScript ka us topic wala chapter (Promises, Event Loop, Prototypes) reference ki tarah dekh lo, bas.

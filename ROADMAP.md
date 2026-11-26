# GC Prep: Final Interview on Monday, 30 Nov 2026

**Bacha time:** 4 din (Thu 26 → Sun 29 Nov). Monday ko GC hai.
**GC mein kya aayega:** template ke L1/L2 topics + DSA.
**Rule:** Sirf highest-ROI cheezein, priority order mein. Jo neeche ki priority ka hai, wo tabhi karna jab upar ka sab ho jaye.
**Source:** `View Template.mhtml` (EPAM JS FullStack React template)

---

## 📊 GC Readiness Tracker

Har session ke baad update hoga. Weight = interview mein us area ka andaazan hissa.

| # | Area | Priority | Weight | Status | Confidence |
|---|---|---|---|---|---|
| 1 | JS core Q&A (scope, hoisting, closures, `this`, coercion, event loop, promises) | 🔴 P1 | 20 | 🟡 Drill done (14.75/24 ≈ 61%), Day 4 mock mein retest | 🟡 |
| 2 | Polyfills | 🔴 P1 | 10 | ✅ Done (42/42) | 🟢 |
| 3 | JS coding tasks (data processing + async) | 🔴 P1 | 10 | ⬜ | — |
| 4 | DSA (arrays, hashing, two pointers, sliding window, stack, strings) | 🔴 P1 | 20 | ⬜ | — |
| 5 | React (hooks, re-render, state/props, forms, context, custom hooks, router) | 🔴 P1 | 20 | ⬜ | — |
| 6 | Node + Express (modules, npm, event loop, middleware, REST, errors, JWT) | 🟠 P2 | 8 | ⬜ | — |
| 7 | TypeScript (types vs interface, generics, utility types, `infer`, decorators, OOP in TS) | 🟠 P2 | 5 | ⬜ | — |
| 8 | OOP / prototypes / classes | 🟠 P2 | 3 | ⬜ | — |
| 9 | Redux basics, HTML/CSS, Git, PostgreSQL vs MongoDB | 🟡 P3 | 4 | ⬜ | — |

**GC readiness: 22 / 100** (polyfills 10 + JS core 12/20)

Confidence: 🔴 kamzor · 🟡 theek-thaak · 🟢 interview-ready

---

## Day 1: Thu 26 Nov (JS core + DSA foundation)

| Block | Time | Kya | Kaise |
|---|---|---|---|
| 1 | 2h | **JS core Q&A drill** with me: hoisting/TDZ, scope, closures, `this` (4 rules + arrow), `==` vs `===`/coercion, event loop output questions, promise chaining/error handling | Main questions dunga, tum bina dekhe jawab doge, galat wale wahin clear karenge |
| 2 | 1h | **T01 Order Report** (25 min timer) + mentor ka **Expense Dashboard** (20 min) | Timer lagao, phir mujhse review |
| 3 | 1h | **T03 Dashboard Loader** | Async ka real use (retry, timeout, `allSettled`) |
| 4 | 3h | **DSA: arrays + hashing**: 1 Two Sum · 217 Contains Duplicate · 242 Valid Anagram · 49 Group Anagrams · 347 Top K Frequent · 238 Product Except Self · 121 Best Time to Buy/Sell · 283 Move Zeroes | Har problem 15–20 min. Na bane to approach mujhse poochho, code khud likho |
| 5 | 30m | Revision: aaj ke galat answers `notes/mistakes.md` mein | — |

## Day 2: Fri 27 Nov (React + DSA patterns)

| Block | Time | Kya |
|---|---|---|
| 1 | 4h | **React hands-on:** chhota Task Manager app: `useState`, `useEffect` fetch (loading/error), list + keys, controlled form + validation, lifting state up, React Router (list/detail/new), Context, custom hook (`useFetch`/`useDebounce`), `React.memo`/`useCallback` sahi jagah |
| 2 | 1h | **React Q&A drill:** re-render kab hota hai, Virtual DOM/reconciliation, keys, `useEffect` cleanup + dependency array, controlled vs uncontrolled, class lifecycle ↔ hooks mapping, HOC/render props, Context vs Redux |
| 3 | 2.5h | **DSA: two pointers + sliding window + stack**: 125 Valid Palindrome · 167 Two Sum II · 15 3Sum · 11 Container With Most Water · 3 Longest Substring w/o Repeating · 20 Valid Parentheses · 155 Min Stack |

## Day 3: Sat 28 Nov (Backend + TS + OOP + DSA)

| Block | Time | Kya |
|---|---|---|
| 1 | 2.5h | **Express API** for the Task Manager: CRUD routes, validation + logger + error middleware, JWT-protected route, MVC folders. Saath mein Node Q&A: CommonJS vs ESM, npm/semver/package-lock, Node event loop, `fs` sync vs async, EventEmitter, REST vs GraphQL, stateless |
| 2 | 2h | **TypeScript (template ka poora L1 + L2):** primitives, unions, function types, custom types (`type`), `interface` vs `type`, `readonly`, classes + `implements` + inheritance, access modifiers (`public`/`private`/`protected`), abstract class, generic functions + generic classes, `Partial`/`Omit`/`ReturnType`, **`infer`** (khud ka `MyReturnType` likho), **decorators** (concept + ek simple `@log` decorator), TS module system/resolution (`tsconfig` basics). **Practice:** T01 + T04 ko TS mein convert karo, generic `Stack<T>` banao |
| 3 | 1h | **T04 Shopping Cart** (classes, `#private`, getters, custom errors) + prototype chain Q&A |
| 4 | 2h | **DSA: binary search + linked list + misc**: 704 Binary Search · 206 Reverse Linked List · 21 Merge Two Sorted Lists · 141 Linked List Cycle · 53 Maximum Subarray · 70 Climbing Stairs |

## Day 4: Sun 29 Nov (Mock + weak areas)

| Block | Time | Kya |
|---|---|---|
| 1 | 2h | **Full mock GC** with me: JS Q&A → live coding task → DSA problem → React → Node, bilkul interview format |
| 2 | 3h | Mock mein jo 🔴 nikle, sirf wahi fix karo |
| 3 | 1.5h | **P3 quick theory:** Redux flow (action → reducer → store, thunk), HTML semantic tags, CSS box model/flexbox/positioning, Git (rebase vs merge, revert vs reset), PostgreSQL vs MongoDB |
| 4 | 1h | Polyfills dobara bina dekhe: `bind`, `Promise.all`, `debounce`, `curry`, `deepClone` |

## Mon 30 Nov: GC 💪
Subah 30 min: `notes/mistakes.md` + top 5 polyfills ek baar. Bas, aur kuch naya nahi.

---

## Cut list (time na bache to skip)
T02 User Directory · T05 Comment Tree · T06 Log Analyzer · LeetCode 30 Days ke baaki problems · MobX · Swagger · decorators · streams deep · AWS/Azure

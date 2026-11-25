# T03 — Dashboard Loader (parallel fetch + retry + timeout)

**Time:** 30 min · **Level:** Medium–Hard · **Tests:** promises, `async/await`, `Promise.allSettled`/`race`, error handling, closures

## Scenario
Team dashboard ek saath kai users ki profile load karta hai. Network flaky hai: kuch requests fail hoti hain, aur kuch atak jaati hain. Ek user fail hone se **poora dashboard crash nahi hona chahiye**.

## Function
```js
async function loadDashboard(userIds, fetchUser, options) {}
```

### Input
- `userIds`: array of ids
- `fetchUser(id)`: ek function jo `Promise<user>` return karta hai (tests isse fake karte hain)
- `options`: `{ timeoutMs = 1000, retries = 1 }`

### Rules
1. Saare users **parallel** mein fetch karo, ek ke baad ek nahi.
2. Har attempt `timeoutMs` ke baad `Error("Timeout")` se fail ho jaana chahiye.
3. Attempt fail ho (reject ya timeout) to **`retries` baar aur** try karo. `retries: 1` matlab max 2 attempts.
4. Function kabhi throw/reject **nahi** karta. Hamesha ye return karta hai:
```js
{
  users:  [/* successful users, userIds ke ORDER mein */],
  failed: [{ id, reason }] // reason = last error ka message, userIds ke order mein
}
```

## Run
```bash
node --test practice/tasks/T03-dashboard-loader/solution.test.js
```

## Discussion questions
1. `Promise.all` vs `Promise.allSettled`: yahan kaunsa aur kyun?
2. Timeout ke baad bhi original request chal rahi hoti hai. Real `fetch` mein use cancel kaise karoge? (`AbortController`)
3. Retry turant karna theek hai? (exponential backoff, kab retry NAHI karna chahiye, jaise 4xx errors)
4. 500 users hon to sab parallel bhejna theek hai? (concurrency limit / batching)

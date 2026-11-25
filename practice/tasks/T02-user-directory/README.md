# T02 — User Directory (search + filter + sort + pagination)

**Time:** 25 min · **Level:** Medium · **Tests:** string handling, sorting traps, pagination math, validation, immutability

## Scenario
Admin panel ki "Users" table ke liye ek helper banana hai jo search, filter, sort aur pagination handle kare. Bilkul waisa jaisa ek real `GET /users?search=..&page=2` API andar se karti hai.

## Function
```js
function queryUsers(users, query) {}
```

### Input
`users`: array of `{ id, name, email, role, age }`

`query` (sab optional):
| key | default | meaning |
|---|---|---|
| `search` | — | `name` **ya** `email` mein case-insensitive substring match. Pehle trim karo, aur blank ho to ignore karo |
| `role` | — | exact match |
| `sortBy` | — | `"name"` ya `"age"`. Na ho to original order rakho |
| `order` | `"asc"` | `"asc"` / `"desc"` |
| `page` | `1` | 1-based. `page < 1` ho to `RangeError` throw karo |
| `pageSize` | `5` | |

**Order of operations:** filter → sort → paginate

### Output
```js
{
  data: [/* current page ke users */],
  meta: { total, page, pageSize, totalPages, hasNext }
}
```
- `total` = filtering ke **baad** wala count
- `totalPages` = `Math.ceil(total / pageSize)` (0 users ho to 0)
- Page range se bahar ho to `data: []` do, par `meta` phir bhi sahi hona chahiye

> ⚠️ Trap: kuch names lowercase mein shuru hote hain. Name sort case-insensitive hona chahiye (`localeCompare` socho).
> ⚠️ Trap: input array ko mutate mat karna.

## Run
```bash
node --test practice/tasks/T02-user-directory/solution.test.js
```

## Discussion questions
1. Ye logic DB query mein jaaye to kaisa dikhega? (`WHERE`, `ORDER BY`, `LIMIT/OFFSET`; MongoDB mein `find().sort().skip().limit()`)
2. Offset pagination vs cursor pagination: bade datasets pe kaunsa better hai, aur kyun?
3. Frontend pe search input ke saath ye function har keystroke pe call ho raha hai. Kya karoge? (debounce)

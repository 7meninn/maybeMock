# T05 — Comment Tree (Recursion + Map)

**Time:** 30 min · **Level:** Medium · **Tests:** recursion, `Map` lookups, object references, tree traversal, immutability

## Scenario
Database comments ko **flat list** mein return karta hai, aur har comment ke saath uska `parentId` hota hai (Reddit/YouTube jaise nested replies). Frontend ko inhe **nested tree** mein render karna hai. Saath hi kuch stats bhi chahiye.

## Input
```js
const comments = [
  { id: 1, parentId: null, author: "asha", text: "Great post" },
  { id: 2, parentId: 1,    author: "ravi", text: "Agreed" },
  // ...
];
```
⚠️ **Order ki koi guarantee nahi hai.** Reply apne parent se **pehle** bhi aa sakta hai.

## Functions

### 1. `buildCommentTree(comments)`
Ye array of root nodes return karega. Node ka shape:
```js
{ id, author, text, replies: [/* child nodes */] }   // parentId output mein nahi aayega
```
- `parentId: null` wale comments root hain.
- **Orphan** comment (jiska `parentId` list mein exist hi nahi karta) bhi root level pe jayega.
- Siblings (roots bhi) ka order wahi rahega jo input array mein tha.
- Input array ya uske objects ko mutate nahi karna.

### 2. `countReplies(node)`
Kisi node ke **saare** descendants ka count: replies, replies ke replies, waghera.

### 3. `maxDepth(tree)`
Roots ki depth `1` hai. Empty tree ki depth `0`.

### 4. `findThread(tree, id)`
Root se us comment tak ke ids ka path return karo, jaise `[1, 2, 3]`. Comment na mile to `null`.

## Run
```bash
node --test practice/tasks/T05-comment-tree/solution.test.js
```

## Discussion questions
1. `buildCommentTree` ki time complexity kya hai? Har comment ke liye parent ko `.find()` se dhoondoge to kitni hogi, aur `Map` se kitni?
2. Bahut deep thread (10,000 levels) pe recursion ke saath kya problem aayegi? Iterative version kaise likhoge (stack/queue se)?
3. React mein isko render kaise karoge? (recursive `<Comment>` component, `key` kya hogi)
4. MongoDB mein comments kaise store karoge: embedded replies ya `parentId` reference? Kyun?

# T01 — Order Report (E-commerce BFF)

**Time:** 25 min · **Level:** Medium · **Tests:** array methods, `reduce`, optional filters, immutability

## Scenario
Tum ek e-commerce company mein junior BFF engineer ho. Backend raw orders deta hai. Admin dashboard ko filtered orders aur ek summary chahiye. Tumhe ek pure function banana hai jo ye data process kare.

## Function
```js
function buildOrderReport(orders, options) {}
```

### Input
`orders`: array of
```js
{ id: 1, customer: "asha", status: "delivered", createdAt: "2024-03-01",
  items: [{ product: "pen", qty: 2, price: 10 }] }
```
`status` ki value `"delivered"`, `"pending"` ya `"cancelled"` hogi.

`options` (sab optional, aur empty string ka matlab hai ki wo filter laga hi nahi):
- `status`: exact match
- `from`, `to`: `"YYYY-MM-DD"`, **inclusive** date range on `createdAt`. Dono mein se sirf ek bhi aa sakta hai.

### Output
```js
{
  orders: [{ id, customer, status, createdAt, total }], // total = Σ qty*price
  summary: {
    revenue,        // sum of totals of filtered orders
    orderCount,
    avgOrderValue,  // revenue / orderCount, 2 decimal places tak round; 0 agar koi order nahi
    topProduct,     // filtered orders mein sabse zyada qty bikne wala product; tie ho to alphabetically pehla; null agar koi nahi
    customerTotals, // { [customer]: total spent }, sirf filtered customers
  }
}
```
- `orders` ko **total ke hisaab se descending** sort karo. Total tie ho to `id` ascending.
- `items` output mein **nahi** aana chahiye.
- Input array ya objects ko **mutate nahi karna** hai.

## Example
```js
buildOrderReport(orders, { status: "delivered" }).summary
// { revenue: 1630, orderCount: 3, avgOrderValue: 543.33, topProduct: "book",
//   customerTotals: { ravi: 1000, meera: 410, asha: 220 } }
```
Baaki cases `solution.test.js` mein hain.

## Run
```bash
node --test practice/tasks/T01-order-report/solution.test.js
```

## Discussion questions (mentor ye pooch sakta hai)
1. 10 lakh orders hon to kya optimise karoge? (Kitne passes lag rahe hain? Kya ek `reduce` mein sab ho sakta hai?)
2. Pagination add karni ho to kahan karoge, sort se pehle ya baad mein? Kyun?
3. `.sort()` input ko mutate karta hai. Isse kaise bachoge? (`toSorted`, spread)
4. Currency mein floating point issues kaise handle karte hain? (paise mein integers rakhna)

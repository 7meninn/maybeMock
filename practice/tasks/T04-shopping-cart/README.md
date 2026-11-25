# T04 — Shopping Cart (Classes + Custom Errors)

**Time:** 30 min · **Level:** Medium · **Tests:** `class`, `#private` fields, getters, `static`, method chaining, custom error hierarchy (`extends Error`), `instanceof`

## Scenario
Checkout service ke liye ek `Cart` class banani hai. Business rules galat input pe **specific errors** throw karte hain, taaki API layer har error ka sahi HTTP response bhej sake (`OutOfStockError` → 409, `InvalidCouponError` → 400, waghera).

## Kya export karna hai
```js
class CartError extends Error {}               // base error
class OutOfStockError extends CartError {}     // extra fields: productId, available
class InvalidCouponError extends CartError {}  // extra field: code
class Cart {}
```
Har error ka `err.name` uski class ke naam jaisa hona chahiye (`"OutOfStockError"`, waghera).

## `Cart` API
```js
const cart = new Cart(inventory);
// inventory: { [productId]: { name, price, stock } }
```

| Member | Behaviour |
|---|---|
| `static COUPONS` | `{ SAVE10: { type: "percent", value: 10 }, FLAT100: { type: "flat", value: 100, minSubtotal: 500 } }` |
| `addItem(productId, qty = 1)` | Product inventory mein na ho to `CartError("Unknown product: <id>")`. `qty` positive integer na ho to `RangeError`. Cart mein total qty `stock` se zyada ho jaye to `OutOfStockError` (aur cart pe koi change nahi hona chahiye). Same product dobara add ho to qty badhao, position wahi rahe. **`this` return karo** (chaining ke liye) |
| `removeItem(productId)` | Product poora hata do. Cart mein na ho to `CartError`. `this` return karo |
| `applyCoupon(code)` | Unknown code ho to `InvalidCouponError`. `minSubtotal` poora na ho to bhi `InvalidCouponError`. Ek waqt pe ek hi coupon rahega (naya coupon purane ko replace karega). `this` return karo |
| `get items` | `[{ productId, name, price, qty, lineTotal }]`, insertion order mein. Ye ek **copy** honi chahiye: bahar se mutate karne pe cart pe asar nahi padna chahiye |
| `get subtotal` | Saare `lineTotal` ka sum |
| `get discount` | Har baar **live calculate** hoga. Percent coupon: `subtotal * value / 100`. Flat coupon: `min(value, subtotal)`. Agar items hatne se `minSubtotal` se neeche chale gaye, to discount `0` |
| `get total` | `subtotal - discount` |

**Encapsulation:** `Object.keys(cart)` empty array hona chahiye, yaani saari state `#private` fields mein.

## Example
```js
const cart = new Cart(inventory).addItem("p1").addItem("p2", 2).applyCoupon("SAVE10");
cart.subtotal; // 2500
cart.discount; // 250
cart.total;    // 2250
```

## Run
```bash
node --test practice/tasks/T04-shopping-cart/solution.test.js
```

## Discussion questions
1. `class` aur constructor function + prototype mein kya fark hai? `typeof Cart` kya dega?
2. `#items` vs `_items` (convention) vs closure se private data: teeno ke trade-offs?
3. `discount` ko property mein store kyun nahi kiya, getter kyun banaya? (derived state, stale data)
4. Express mein ek error middleware likho jo `instanceof` dekh ke status code set kare.
5. `extends Error` karte waqt `super(message)` kyun zaroori hai? `this.name` set na karo to stack trace mein kya dikhega?

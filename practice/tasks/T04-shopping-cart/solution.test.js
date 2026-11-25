const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { Cart, CartError, OutOfStockError, InvalidCouponError } = require("./solution");

const inventory = () => ({
  p1: { name: "Keyboard", price: 1500, stock: 3 },
  p2: { name: "Mouse", price: 500, stock: 10 },
  p3: { name: "Cable", price: 150, stock: 0 },
});

describe("adding and removing items", () => {
  test("addItem is chainable and items has the right shape", () => {
    const cart = new Cart(inventory()).addItem("p1").addItem("p2", 2);
    assert.deepEqual(cart.items, [
      { productId: "p1", name: "Keyboard", price: 1500, qty: 1, lineTotal: 1500 },
      { productId: "p2", name: "Mouse", price: 500, qty: 2, lineTotal: 1000 },
    ]);
    assert.equal(cart.subtotal, 2500);
    assert.equal(cart.total, 2500);
  });

  test("adding the same product increases qty and keeps position", () => {
    const cart = new Cart(inventory()).addItem("p1").addItem("p2").addItem("p1", 2);
    assert.deepEqual(cart.items.map((i) => [i.productId, i.qty]), [["p1", 3], ["p2", 1]]);
  });

  test("empty cart", () => {
    const cart = new Cart(inventory());
    assert.deepEqual(cart.items, []);
    assert.equal(cart.subtotal, 0);
    assert.equal(cart.discount, 0);
    assert.equal(cart.total, 0);
  });

  test("unknown product throws CartError", () => {
    const cart = new Cart(inventory());
    assert.throws(() => cart.addItem("p9"), (err) => {
      assert.ok(err instanceof CartError);
      assert.equal(err.message, "Unknown product: p9");
      return true;
    });
  });

  test("invalid qty throws RangeError", () => {
    const cart = new Cart(inventory());
    assert.throws(() => cart.addItem("p1", 0), RangeError);
    assert.throws(() => cart.addItem("p1", -2), RangeError);
    assert.throws(() => cart.addItem("p1", 1.5), RangeError);
  });

  test("exceeding stock throws OutOfStockError and leaves cart unchanged", () => {
    const cart = new Cart(inventory()).addItem("p1", 2);
    assert.throws(() => cart.addItem("p1", 2), (err) => {
      assert.ok(err instanceof OutOfStockError);
      assert.ok(err instanceof CartError);
      assert.ok(err instanceof Error);
      assert.equal(err.name, "OutOfStockError");
      assert.equal(err.productId, "p1");
      assert.equal(err.available, 3);
      return true;
    });
    assert.equal(cart.items[0].qty, 2);
  });

  test("zero-stock product cannot be added", () => {
    assert.throws(() => new Cart(inventory()).addItem("p3"), OutOfStockError);
  });

  test("removeItem removes product fully and is chainable", () => {
    const cart = new Cart(inventory()).addItem("p1").addItem("p2", 3).removeItem("p1");
    assert.deepEqual(cart.items.map((i) => i.productId), ["p2"]);
    assert.equal(cart.subtotal, 1500);
  });

  test("removing a product not in cart throws CartError", () => {
    assert.throws(() => new Cart(inventory()).removeItem("p1"), CartError);
  });
});

describe("coupons", () => {
  test("static COUPONS are defined on the class", () => {
    assert.deepEqual(Cart.COUPONS, {
      SAVE10: { type: "percent", value: 10 },
      FLAT100: { type: "flat", value: 100, minSubtotal: 500 },
    });
  });

  test("percent coupon", () => {
    const cart = new Cart(inventory()).addItem("p1").addItem("p2", 2).applyCoupon("SAVE10");
    assert.equal(cart.discount, 250);
    assert.equal(cart.total, 2250);
  });

  test("flat coupon at exactly minSubtotal", () => {
    const cart = new Cart(inventory()).addItem("p2").applyCoupon("FLAT100");
    assert.equal(cart.total, 400);
  });

  test("flat coupon below minSubtotal throws InvalidCouponError", () => {
    const cart = new Cart(inventory()).addItem("p2");
    cart.removeItem("p2");
    assert.throws(() => cart.applyCoupon("FLAT100"), (err) => {
      assert.ok(err instanceof InvalidCouponError);
      assert.ok(err instanceof CartError);
      assert.equal(err.name, "InvalidCouponError");
      assert.equal(err.code, "FLAT100");
      return true;
    });
  });

  test("unknown coupon throws InvalidCouponError with code", () => {
    const cart = new Cart(inventory()).addItem("p1");
    assert.throws(() => cart.applyCoupon("FREE"), (err) => err instanceof InvalidCouponError && err.code === "FREE");
  });

  test("discount is recalculated when cart changes", () => {
    const cart = new Cart(inventory()).addItem("p2").applyCoupon("SAVE10");
    assert.equal(cart.discount, 50);
    cart.addItem("p1");
    assert.equal(cart.discount, 200);
    assert.equal(cart.total, 1800);
  });

  test("flat coupon stops applying when subtotal falls below minimum", () => {
    const cart = new Cart(inventory()).addItem("p2", 2).applyCoupon("FLAT100");
    assert.equal(cart.total, 900);
    cart.removeItem("p2");
    assert.equal(cart.discount, 0);
    assert.equal(cart.total, 0);
  });

  test("new coupon replaces the old one", () => {
    const cart = new Cart(inventory()).addItem("p1").applyCoupon("SAVE10").applyCoupon("FLAT100");
    assert.equal(cart.discount, 100);
  });
});

describe("encapsulation", () => {
  test("no public instance state", () => {
    const cart = new Cart(inventory()).addItem("p1");
    assert.deepEqual(Object.keys(cart), []);
  });

  test("items returns a copy", () => {
    const cart = new Cart(inventory()).addItem("p1");
    cart.items.push({ productId: "hack", qty: 1, price: 1, lineTotal: 1 });
    cart.items[0].qty = 99;
    assert.equal(cart.items.length, 1);
    assert.equal(cart.items[0].qty, 1);
    assert.equal(cart.subtotal, 1500);
  });

  test("subtotal and total are getters, not methods", () => {
    const cart = new Cart(inventory()).addItem("p1");
    assert.equal(typeof cart.subtotal, "number");
    assert.equal(typeof cart.total, "number");
  });
});

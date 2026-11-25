const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildOrderReport } = require("./solution");

const orders = [
  { id: 1, customer: "asha", status: "delivered", createdAt: "2024-03-01",
    items: [{ product: "pen", qty: 2, price: 10 }, { product: "book", qty: 1, price: 200 }] },
  { id: 2, customer: "ravi", status: "pending", createdAt: "2024-03-03",
    items: [{ product: "pen", qty: 5, price: 10 }] },
  { id: 3, customer: "asha", status: "cancelled", createdAt: "2024-03-05",
    items: [{ product: "bag", qty: 1, price: 800 }] },
  { id: 4, customer: "meera", status: "delivered", createdAt: "2024-03-07",
    items: [{ product: "book", qty: 2, price: 200 }, { product: "pen", qty: 1, price: 10 }] },
  { id: 5, customer: "ravi", status: "delivered", createdAt: "2024-03-10",
    items: [{ product: "bag", qty: 1, price: 800 }, { product: "book", qty: 1, price: 200 }] },
];

const row = (o, total) => ({ id: o.id, customer: o.customer, status: o.status, createdAt: o.createdAt, total });
const [o1, o2, o3, o4, o5] = orders;

test("no filters: all orders sorted by total desc", () => {
  assert.deepEqual(buildOrderReport(orders, {}), {
    orders: [row(o5, 1000), row(o3, 800), row(o4, 410), row(o1, 220), row(o2, 50)],
    summary: {
      revenue: 2480,
      orderCount: 5,
      avgOrderValue: 496,
      topProduct: "pen",
      customerTotals: { asha: 1020, ravi: 1050, meera: 410 },
    },
  });
});

test("options argument is optional", () => {
  assert.equal(buildOrderReport(orders).summary.orderCount, 5);
});

test("filter by status", () => {
  assert.deepEqual(buildOrderReport(orders, { status: "delivered" }), {
    orders: [row(o5, 1000), row(o4, 410), row(o1, 220)],
    summary: {
      revenue: 1630,
      orderCount: 3,
      avgOrderValue: 543.33,
      topProduct: "book",
      customerTotals: { ravi: 1000, meera: 410, asha: 220 },
    },
  });
});

test("inclusive date range", () => {
  const r = buildOrderReport(orders, { from: "2024-03-03", to: "2024-03-07" });
  assert.deepEqual(r.orders.map((o) => o.id), [3, 4, 2]);
  assert.equal(r.summary.revenue, 1260);
  assert.equal(r.summary.topProduct, "pen");
});

test("status + only `from`, topProduct tie goes alphabetical", () => {
  const r = buildOrderReport(orders, { status: "delivered", from: "2024-03-08" });
  assert.deepEqual(r.orders.map((o) => o.id), [5]);
  assert.equal(r.summary.topProduct, "bag");
  assert.deepEqual(r.summary.customerTotals, { ravi: 1000 });
});

test("empty string filter is ignored", () => {
  assert.equal(buildOrderReport(orders, { status: "", from: "", to: "" }).summary.orderCount, 5);
});

test("no matches returns empty-safe summary", () => {
  assert.deepEqual(buildOrderReport(orders, { status: "returned" }), {
    orders: [],
    summary: { revenue: 0, orderCount: 0, avgOrderValue: 0, topProduct: null, customerTotals: {} },
  });
});

test("ties on total are ordered by id asc", () => {
  const same = [
    { id: 9, customer: "x", status: "pending", createdAt: "2024-01-01", items: [{ product: "a", qty: 1, price: 100 }] },
    { id: 7, customer: "y", status: "pending", createdAt: "2024-01-02", items: [{ product: "b", qty: 2, price: 50 }] },
  ];
  assert.deepEqual(buildOrderReport(same).orders.map((o) => o.id), [7, 9]);
});

test("does not mutate input", () => {
  const snapshot = structuredClone(orders);
  buildOrderReport(orders, { status: "delivered" });
  assert.deepEqual(orders, snapshot);
});

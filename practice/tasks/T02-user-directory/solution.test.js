const { test } = require("node:test");
const assert = require("node:assert/strict");
const { queryUsers } = require("./solution");

const users = [
  { id: 1, name: "Aman Gupta", email: "aman@corp.com", role: "admin", age: 31 },
  { id: 2, name: "bhavna rao", email: "bhavna@corp.com", role: "dev", age: 26 },
  { id: 3, name: "Chirag Shah", email: "chirag@mail.com", role: "dev", age: 29 },
  { id: 4, name: "Divya Nair", email: "divya@corp.com", role: "qa", age: 24 },
  { id: 5, name: "Esha Kapoor", email: "esha@mail.com", role: "dev", age: 35 },
  { id: 6, name: "Farhan Ali", email: "farhan@corp.com", role: "admin", age: 41 },
  { id: 7, name: "Gaurav Sen", email: "gaurav@mail.com", role: "dev", age: 22 },
  { id: 8, name: "Harsh Vardhan", email: "harsh@corp.com", role: "qa", age: 30 },
];
const ids = (r) => r.data.map((u) => u.id);

test("defaults: page 1, size 5, original order", () => {
  const r = queryUsers(users, {});
  assert.deepEqual(ids(r), [1, 2, 3, 4, 5]);
  assert.deepEqual(r.meta, { total: 8, page: 1, pageSize: 5, totalPages: 2, hasNext: true });
});

test("query argument is optional", () => {
  assert.equal(queryUsers(users).meta.total, 8);
});

test("second page", () => {
  const r = queryUsers(users, { page: 2 });
  assert.deepEqual(ids(r), [6, 7, 8]);
  assert.equal(r.meta.hasNext, false);
});

test("search is case-insensitive and checks email", () => {
  const r = queryUsers(users, { search: "MAIL.COM" });
  assert.deepEqual(ids(r), [3, 5, 7]);
  assert.deepEqual(r.meta, { total: 3, page: 1, pageSize: 5, totalPages: 1, hasNext: false });
});

test("search is trimmed", () => {
  assert.deepEqual(ids(queryUsers(users, { search: "  sha " })), [3, 5]);
});

test("blank search is ignored", () => {
  assert.equal(queryUsers(users, { search: "   " }).meta.total, 8);
});

test("role filter + sort by age desc", () => {
  assert.deepEqual(ids(queryUsers(users, { role: "dev", sortBy: "age", order: "desc" })), [5, 3, 2, 7]);
});

test("sort by age asc is default order", () => {
  assert.deepEqual(ids(queryUsers(users, { sortBy: "age", pageSize: 3 })), [7, 4, 2]);
});

test("name sort is case-insensitive", () => {
  assert.deepEqual(ids(queryUsers(users, { sortBy: "name", pageSize: 8 })), [1, 2, 3, 4, 5, 6, 7, 8]);
});

test("name sort desc", () => {
  assert.deepEqual(ids(queryUsers(users, { sortBy: "name", order: "desc", pageSize: 3 })), [8, 7, 6]);
});

test("custom page size, last partial page", () => {
  const r = queryUsers(users, { pageSize: 3, page: 3 });
  assert.deepEqual(ids(r), [7, 8]);
  assert.deepEqual(r.meta, { total: 8, page: 3, pageSize: 3, totalPages: 3, hasNext: false });
});

test("page out of range gives empty data but valid meta", () => {
  const r = queryUsers(users, { page: 5 });
  assert.deepEqual(r.data, []);
  assert.deepEqual(r.meta, { total: 8, page: 5, pageSize: 5, totalPages: 2, hasNext: false });
});

test("page < 1 throws RangeError", () => {
  assert.throws(() => queryUsers(users, { page: 0 }), RangeError);
});

test("empty users list", () => {
  assert.deepEqual(queryUsers([], {}), {
    data: [],
    meta: { total: 0, page: 1, pageSize: 5, totalPages: 0, hasNext: false },
  });
});

test("does not mutate input when sorting", () => {
  const snapshot = structuredClone(users);
  queryUsers(users, { sortBy: "age", order: "desc" });
  assert.deepEqual(users, snapshot);
});

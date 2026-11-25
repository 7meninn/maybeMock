const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadDashboard } = require("./solution");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// fake API: each id has a behaviour
function makeFetcher(behaviour) {
  const calls = {};
  const fetchUser = async (id) => {
    calls[id] = (calls[id] || 0) + 1;
    const b = behaviour[id];
    await wait(b.delay ?? 5);
    if (b.hang) return new Promise(() => {}); // never settles
    if (b.failTimes && calls[id] <= b.failTimes) throw new Error(b.error || "Server error");
    if (b.alwaysFail) throw new Error(b.error || "Server error");
    return { id, name: `user${id}` };
  };
  return { fetchUser, calls };
}

test("all succeed: users keep input order, not finish order", async () => {
  const { fetchUser } = makeFetcher({ 1: { delay: 40 }, 2: { delay: 5 }, 3: { delay: 20 } });
  const r = await loadDashboard([1, 2, 3], fetchUser);
  assert.deepEqual(r, {
    users: [{ id: 1, name: "user1" }, { id: 2, name: "user2" }, { id: 3, name: "user3" }],
    failed: [],
  });
});

test("fetches in parallel", async () => {
  const { fetchUser } = makeFetcher({ 1: { delay: 100 }, 2: { delay: 100 }, 3: { delay: 100 } });
  const start = Date.now();
  await loadDashboard([1, 2, 3], fetchUser);
  assert.ok(Date.now() - start < 250, "took too long, requests are probably sequential");
});

test("permanent failure is reported and retried `retries` times", async () => {
  const { fetchUser, calls } = makeFetcher({ 1: {}, 2: { alwaysFail: true, error: "Not found" } });
  const r = await loadDashboard([1, 2], fetchUser, { retries: 1 });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.deepEqual(r.failed, [{ id: 2, reason: "Not found" }]);
  assert.equal(calls[2], 2);
});

test("flaky request succeeds on retry", async () => {
  const { fetchUser, calls } = makeFetcher({ 1: { failTimes: 2 } });
  const r = await loadDashboard([1], fetchUser, { retries: 2 });
  assert.deepEqual(r, { users: [{ id: 1, name: "user1" }], failed: [] });
  assert.equal(calls[1], 3);
});

test("retries: 0 means a single attempt", async () => {
  const { fetchUser, calls } = makeFetcher({ 1: { failTimes: 1 } });
  const r = await loadDashboard([1], fetchUser, { retries: 0 });
  assert.deepEqual(r.failed, [{ id: 1, reason: "Server error" }]);
  assert.equal(calls[1], 1);
});

test("hanging request times out", async () => {
  const { fetchUser } = makeFetcher({ 1: {}, 2: { hang: true } });
  const r = await loadDashboard([1, 2], fetchUser, { timeoutMs: 50, retries: 0 });
  assert.deepEqual(r.users.map((u) => u.id), [1]);
  assert.deepEqual(r.failed, [{ id: 2, reason: "Timeout" }]);
});

test("failed list keeps input order", async () => {
  const { fetchUser } = makeFetcher({
    1: { alwaysFail: true, error: "A", delay: 30 },
    2: {},
    3: { alwaysFail: true, error: "B", delay: 5 },
  });
  const r = await loadDashboard([1, 2, 3], fetchUser, { retries: 0 });
  assert.deepEqual(r.failed, [{ id: 1, reason: "A" }, { id: 3, reason: "B" }]);
});

test("empty input", async () => {
  const { fetchUser } = makeFetcher({});
  assert.deepEqual(await loadDashboard([], fetchUser), { users: [], failed: [] });
});

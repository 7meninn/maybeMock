const { test } = require("node:test");
const assert = require("node:assert/strict");
const { buildCommentTree, countReplies, maxDepth, findThread } = require("./solution");

// child (3) appears before its parent (2); 7 is an orphan
const comments = [
  { id: 3, parentId: 2, author: "meera", text: "Source?" },
  { id: 1, parentId: null, author: "asha", text: "Great post" },
  { id: 2, parentId: 1, author: "ravi", text: "Agreed" },
  { id: 4, parentId: null, author: "dev", text: "First!" },
  { id: 5, parentId: 1, author: "kiran", text: "Nice" },
  { id: 6, parentId: 3, author: "ravi", text: "Here you go" },
  { id: 7, parentId: 99, author: "ghost", text: "Parent was deleted" },
];

const node = (c, replies = []) => ({ id: c.id, author: c.author, text: c.text, replies });
const byId = Object.fromEntries(comments.map((c) => [c.id, c]));

test("builds the nested tree regardless of input order", () => {
  assert.deepEqual(buildCommentTree(comments), [
    node(byId[1], [
      node(byId[2], [node(byId[3], [node(byId[6])])]),
      node(byId[5]),
    ]),
    node(byId[4]),
    node(byId[7]),
  ]);
});

test("empty input", () => {
  assert.deepEqual(buildCommentTree([]), []);
});

test("does not mutate input", () => {
  const snapshot = structuredClone(comments);
  buildCommentTree(comments);
  assert.deepEqual(comments, snapshot);
});

test("countReplies counts all descendants", () => {
  const [first, second] = buildCommentTree(comments);
  assert.equal(countReplies(first), 4);
  assert.equal(countReplies(second), 0);
  assert.equal(countReplies(first.replies[0]), 2);
});

test("maxDepth", () => {
  assert.equal(maxDepth(buildCommentTree(comments)), 4);
  assert.equal(maxDepth(buildCommentTree([{ id: 1, parentId: null, author: "a", text: "x" }])), 1);
  assert.equal(maxDepth([]), 0);
});

test("findThread returns path from root", () => {
  const tree = buildCommentTree(comments);
  assert.deepEqual(findThread(tree, 6), [1, 2, 3, 6]);
  assert.deepEqual(findThread(tree, 5), [1, 5]);
  assert.deepEqual(findThread(tree, 4), [4]);
  assert.deepEqual(findThread(tree, 7), [7]);
});

test("findThread returns null when not found", () => {
  assert.equal(findThread(buildCommentTree(comments), 42), null);
});

test("handles a long flat list quickly", () => {
  const many = [];
  for (let i = 1; i <= 20000; i++) many.push({ id: i, parentId: i % 2 === 0 ? i - 1 : null, author: "u", text: "t" });
  const start = Date.now();
  const tree = buildCommentTree(many);
  assert.equal(tree.length, 10000);
  assert.ok(Date.now() - start < 500, "too slow, are you searching the whole array for each parent?");
});

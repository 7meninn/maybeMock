const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { analyzeLogs, writeReport } = require("./solution");

let root;
let logsDir;
let emptyDir;
let quietDir;

before(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "t06-"));
  logsDir = path.join(root, "logs");
  emptyDir = path.join(root, "empty");
  quietDir = path.join(root, "quiet");
  await fs.mkdir(path.join(logsDir, "old"), { recursive: true });
  await fs.mkdir(emptyDir);
  await fs.mkdir(quietDir);

  await fs.writeFile(
    path.join(logsDir, "app.log"),
    [
      "2024-03-01T10:00:00Z [INFO] auth: user logged in",
      "2024-03-01T10:01:00Z [ERROR] payments: card declined",
      "",
      "2024-03-01T10:02:00Z [WARN] auth: slow response",
      "this line is broken",
      "",
    ].join("\n")
  );
  // Windows line endings
  await fs.writeFile(
    path.join(logsDir, "worker.log"),
    [
      "2024-03-01T11:00:00Z [ERROR] payments: card declined",
      "2024-03-01T11:05:00Z [ERROR] email: smtp timeout",
      "2024-03-01T11:06:00Z [INFO] email: queued 5 mails",
    ].join("\r\n")
  );
  // must be ignored: wrong extension, and a .log inside a subfolder
  await fs.writeFile(path.join(logsDir, "notes.txt"), "2024-03-01T11:00:00Z [ERROR] x: ignore me\n");
  await fs.writeFile(path.join(logsDir, "old", "archive.log"), "2024-02-01T11:00:00Z [ERROR] x: ignore me too\n");

  await fs.writeFile(path.join(quietDir, "a.log"), "2024-03-01T10:00:00Z [INFO] api: started\n");
});

after(async () => {
  await fs.rm(root, { recursive: true, force: true });
});

test("analyzes all .log files in the folder", async () => {
  assert.deepEqual(await analyzeLogs(logsDir), {
    files: 2,
    totalLines: 6,
    byLevel: { INFO: 2, WARN: 1, ERROR: 3 },
    errorsByService: { payments: 2, email: 1 },
    topError: "card declined",
    malformed: 1,
  });
});

test("empty folder", async () => {
  assert.deepEqual(await analyzeLogs(emptyDir), {
    files: 0,
    totalLines: 0,
    byLevel: { INFO: 0, WARN: 0, ERROR: 0 },
    errorsByService: {},
    topError: null,
    malformed: 0,
  });
});

test("no errors gives topError null", async () => {
  const r = await analyzeLogs(quietDir);
  assert.equal(r.topError, null);
  assert.deepEqual(r.byLevel, { INFO: 1, WARN: 0, ERROR: 0 });
});

test("missing folder rejects with ENOENT", async () => {
  await assert.rejects(analyzeLogs(path.join(root, "nope")), { code: "ENOENT" });
});

test("topError tie goes alphabetical", async () => {
  const dir = path.join(root, "tie");
  await fs.mkdir(dir);
  await fs.writeFile(
    path.join(dir, "x.log"),
    "2024-03-01T10:00:00Z [ERROR] db: timeout\n2024-03-01T10:00:01Z [ERROR] db: deadlock\n"
  );
  assert.equal((await analyzeLogs(dir)).topError, "deadlock");
});

test("writeReport creates nested folders and writes pretty JSON", async () => {
  const out = path.join(root, "out", "reports", "summary.json");
  const report = await writeReport(logsDir, out);
  const raw = await fs.readFile(out, "utf8");
  assert.deepEqual(JSON.parse(raw), report);
  assert.equal(raw, JSON.stringify(report, null, 2));
  assert.equal(report.files, 2);
});

test("does not use sync fs APIs", async () => {
  const src = await fs.readFile(path.join(__dirname, "solution.js"), "utf8");
  assert.doesNotMatch(src, /\w+Sync\(/);
});

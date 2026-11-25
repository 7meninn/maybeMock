# T06 — Log Analyzer (Node.js `fs` + `path`)

**Time:** 35 min · **Level:** Medium · **Tests:** `fs/promises`, `path`, async file I/O, string parsing with regex, Windows vs Unix line endings, Node error codes

## Scenario
Production servers ek folder mein `.log` files likhte hain. On-call engineer ko ek script chahiye jo folder ki saari logs padh ke summary report bana de: kitne errors aaye, kaunsi service sabse zyada fail ho rahi hai, aur kaunsa error sabse common hai.

## Log line format
```
2024-03-01T10:01:00Z [ERROR] payments: card declined
<timestamp>          [LEVEL] <service>: <message>
```
- `LEVEL` in teeno mein se ek hoga: `INFO`, `WARN`, `ERROR` (uppercase)
- Blank lines ignore karo
- Jo non-blank line format se match na kare, wo **malformed** count hogi
- ⚠️ Kuch files Windows se aati hain, unme line endings `\r\n` hain

## Functions

### 1. `async analyzeLogs(dirPath)`
- `dirPath` ke andar ki sirf **`.log` extension** wali files padho. Baaki files aur **subfolders ignore** karo (recursive nahi jaana)
- Folder exist na kare to promise Node ke original error se reject ho (`err.code === "ENOENT"`)

Ye return karna hai:
```js
{
  files: 2,                                   // kitni .log files padhi
  totalLines: 6,                              // sirf valid lines
  byLevel: { INFO: 2, WARN: 1, ERROR: 3 },    // teeno keys hamesha, chahe 0 ho
  errorsByService: { payments: 2, email: 1 }, // sirf ERROR lines
  topError: "card declined",                  // sabse common ERROR message; tie ho to alphabetically pehla; koi error na ho to null
  malformed: 1,
}
```

### 2. `async writeReport(dirPath, outFile)`
`analyzeLogs(dirPath)` chalao aur result ko `outFile` mein **pretty JSON** (2 spaces) ki tarah likho. Agar `outFile` ke parent folders exist nahi karte, to unhe bana do. Return mein report object do.

**Sirf `fs/promises` (ya `fs.promises`) use karna, `readFileSync` jaisi sync APIs nahi.**

## Run
```bash
node --test practice/tasks/T06-log-analyzer/solution.test.js
```

## Discussion questions
1. `readFile` vs `readFileSync` vs `createReadStream`: 5 GB ki log file ho to kaunsa use karoge, aur kyun?
2. Saari files parallel mein padhoge ya ek-ek karke? 10,000 files hon to?
3. `path.join` vs string concat (`dir + "/" + file`): Windows pe kya toot jayega?
4. Server pe ye script har 5 min chalani ho to kaise karoge? (cron, `setInterval`, alerting)
5. `ENOENT`, `EACCES`, `EISDIR`: ye error codes kya batate hain?

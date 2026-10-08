import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawnSync, spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderBlock, applyBlock, MAX_ITEMS, START, END } from "../scripts/update-recent.mjs";

const SCRIPT = fileURLToPath(new URL("../scripts/update-recent.mjs", import.meta.url));
const proj = (title = "Docket Lens", last_active = "2026-10", path = "projects/docket-lens/") => ({
  title,
  url: `https://shawnskelly.com/${path}`,
  last_active,
});
const doc = (projects, extra = {}) => ({ schema_version: 1, through: "2026-10-04", projects, ...extra });
const README = (eol) => ["# Me", "", "## Recently active", START, "No recent public activity.", END, "", "tail", ""].join(eol);

// --- renderBlock ---
test("render: 0 projects gives the fixed line, null through accepted", () => {
  assert.equal(renderBlock({ schema_version: 1, through: null, projects: [] }), "No recent public activity.");
});
test("render: 1 project", () => {
  assert.equal(
    renderBlock(doc([proj()])),
    "- [Docket Lens](https://shawnskelly.com/projects/docket-lens/), active Oct 2026",
  );
});
test("render: many keep input order, ties preserved, not sorted", () => {
  const out = renderBlock(
    doc([proj("Zed", "2026-10", "projects/z/"), proj("Alpha", "2026-10", "projects/a/"), proj("Mid", "2026-12", "projects/m/")]),
  );
  assert.deepEqual(out.split("\n").map((l) => l.split("]")[0]), ["- [Zed", "- [Alpha", "- [Mid"]);
  assert.match(out, /active Dec 2026$/);
});
test("render: capped at MAX_ITEMS, exactly MAX_ITEMS kept whole", () => {
  const mk = (n) => Array.from({ length: n }, (_, i) => proj(`P${i}`, "2026-01", `projects/p${i}/`));
  assert.equal(renderBlock(doc(mk(MAX_ITEMS))).split("\n").length, MAX_ITEMS);
  const over = renderBlock(doc(mk(MAX_ITEMS + 1))).split("\n");
  assert.equal(over.length, MAX_ITEMS);
  assert.match(over.at(-1), /P5\]/);
});
test("render: month boundaries 01 and 12 ok", () => {
  assert.match(renderBlock(doc([proj("A", "2026-01")])), /Jan 2026$/);
  assert.match(renderBlock(doc([proj("A", "2026-12")])), /Dec 2026$/);
});
test("render: an invalid entry past the cap is still refused", () => {
  const many = Array.from({ length: MAX_ITEMS }, (_, i) => proj(`P${i}`, "2026-01", `projects/p${i}/`));
  assert.throws(() => renderBlock(doc([...many, proj("Bad]")])));
});

// --- validation refusals ---
const bad = (name, json) => test(`refuse: ${name}`, () => assert.throws(() => renderBlock(json)));
bad("null", null);
bad("array root", []);
bad("string root", "x");
bad("schema_version 2", { ...doc([]), schema_version: 2 });
bad("schema_version string", { ...doc([]), schema_version: "1" });
bad("schema_version missing", { through: null, projects: [] });
bad("projects missing", { schema_version: 1, through: null });
bad("projects object", doc({}));
bad("projects null", doc(null));
bad("through number", doc([], { through: 5 }));
bad("entry null", doc([null]));
bad("entry string", doc(["x"]));
bad("entry array", doc([[]]));
bad("missing title", doc([{ url: "https://shawnskelly.com/a/", last_active: "2026-10" }]));
bad("missing url", doc([{ title: "A", last_active: "2026-10" }]));
bad("missing last_active", doc([{ title: "A", url: "https://shawnskelly.com/a/" }]));
bad("extra field", doc([{ ...proj(), repo: "private-name" }]));
bad("title number", doc([{ ...proj(), title: 5 }]));
bad("url number", doc([{ ...proj(), url: 5 }]));
bad("last_active number", doc([{ ...proj(), last_active: 202610 }]));
bad("empty title", doc([proj("")]));
bad("blank title", doc([proj("   ")]));
bad("padded title", doc([proj(" A")]));
for (const [n, ch] of [
  ["newline", "\n"],
  ["CR", "\r"],
  ["]", "]"],
  ["[", "["],
  ["pipe", "|"],
  ["lt", "<"],
  ["backtick", "`"],
  ["backslash", "\\"],
  ["star", "*"],
  ["NUL", "\0"],
]) {
  bad(`title with ${n}`, doc([proj(`A${ch}B`)]));
}
bad("one bad among good", doc([proj(), proj("Bad]"), proj("C", "2026-10", "c/")]));
bad("url http", doc([{ ...proj(), url: "http://shawnskelly.com/a/" }]));
bad("url other host", doc([{ ...proj(), url: "https://evil.example/a/" }]));
bad("url lookalike host", doc([{ ...proj(), url: "https://shawnskelly.com.evil.example/a/" }]));
bad("url userinfo trick", doc([{ ...proj(), url: "https://shawnskelly.com@evil.example/" }]));
bad("url bare prefix", doc([{ ...proj(), url: "https://shawnskelly.com/" }]));
bad("url with space", doc([{ ...proj(), url: "https://shawnskelly.com/a b" }]));
bad("url with paren", doc([{ ...proj(), url: "https://shawnskelly.com/a)b" }]));
bad("url with newline", doc([{ ...proj(), url: "https://shawnskelly.com/a\nb" }]));
for (const la of ["2026-13", "2026-00", "2026-1", "26-10", "2026-10-01", "2026/10", " 2026-10", "2026-10 ", ""]) {
  bad(`last_active ${JSON.stringify(la)}`, doc([proj("A", la)]));
}

// --- applyBlock ---
for (const [name, eol] of [
  ["LF", "\n"],
  ["CRLF", "\r\n"],
]) {
  test(`apply ${name}: replaces only between markers, keeps line endings`, () => {
    const out = applyBlock(
      README(eol),
      "- [A](https://shawnskelly.com/a/), active Oct 2026\n- [B](https://shawnskelly.com/b/), active Sep 2026",
    );
    assert.equal(
      out,
      [
        "# Me",
        "",
        "## Recently active",
        START,
        "- [A](https://shawnskelly.com/a/), active Oct 2026",
        "- [B](https://shawnskelly.com/b/), active Sep 2026",
        END,
        "",
        "tail",
        "",
      ].join(eol),
    );
    // no bare LF in a CRLF file, no CR in an LF file
    assert.equal(out.replace(/\r\n/g, "").includes("\n"), eol === "\n");
    assert.equal(out.includes("\r"), eol === "\r\n");
  });
  test(`apply ${name}: idempotent`, () => {
    const b = "- [A](https://shawnskelly.com/a/), active Oct 2026";
    const once = applyBlock(README(eol), b);
    assert.equal(applyBlock(once, b), once);
  });
}
test("apply: going back to the fixed line round trips", () => {
  const filled = applyBlock(README("\n"), "- [A](https://shawnskelly.com/a/), active Oct 2026");
  assert.equal(applyBlock(filled, "No recent public activity."), README("\n"));
});
test("apply: adjacent markers get a body", () => {
  assert.equal(applyBlock(`${START}${END}`, "x"), `${START}\nx\n${END}`);
});
test("apply: refuses missing start, missing end, neither, duplicates, reversed, empty", () => {
  assert.throws(() => applyBlock(`a\n${END}\n`, "x"));
  assert.throws(() => applyBlock(`a\n${START}\n`, "x"));
  assert.throws(() => applyBlock("a\n", "x"));
  assert.throws(() => applyBlock(`${START}\n${START}\n${END}\n`, "x"));
  assert.throws(() => applyBlock(`${START}\n${END}\n${END}\n`, "x"));
  assert.throws(() => applyBlock(`${END}\n${START}\n`, "x"));
  assert.throws(() => applyBlock("", "x"));
});

// --- CLI: runs the real script ---
function setup(readme, json) {
  const dir = mkdtempSync(join(tmpdir(), "recent-"));
  const rp = join(dir, "README.md");
  const jp = join(dir, "recent.json");
  writeFileSync(rp, readme);
  if (json !== undefined) writeFileSync(jp, typeof json === "string" ? json : JSON.stringify(json));
  return { dir, rp, jp };
}
const run = (args, env = {}) => spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8", env: { ...process.env, ...env } });

test("cli: writes block, preserves CRLF, leaves no tmp file, second run is a no-op", () => {
  const { dir, rp, jp } = setup(README("\r\n"), doc([proj()]));
  const r = run(["--file", jp, "--readme", rp]);
  assert.equal(r.status, 0, r.stderr);
  const after = readFileSync(rp, "utf8");
  assert.match(after, /\[Docket Lens\]\(https:\/\/shawnskelly\.com\/projects\/docket-lens\/\), active Oct 2026\r\n/);
  assert.deepEqual(readdirSync(dir).sort(), ["README.md", "recent.json"]);
  const r2 = run(["--file", jp, "--readme", rp]);
  assert.equal(r2.status, 0);
  assert.match(r2.stdout, /already current/);
  assert.equal(readFileSync(rp, "utf8"), after);
});

const cliFail = (name, readme, json) =>
  test(`cli fail closed: ${name}`, () => {
    const { rp, jp } = setup(readme, json);
    const r = run(["--file", jp, "--readme", rp]);
    assert.equal(r.status, 1);
    assert.equal(readFileSync(rp, "utf8"), readme);
  });
cliFail("invalid JSON", README("\n"), "{not json");
cliFail("empty body", README("\n"), "");
cliFail("wrong schema", README("\n"), doc([], { schema_version: 2 }));
cliFail("bad entry", README("\n"), doc([proj("Bad|Title")]));
cliFail("missing markers", "no markers\n", doc([proj()]));
cliFail("duplicate markers", README("\n") + START + "\n" + END + "\n", doc([proj()]));

test("cli fail closed: --file path missing", () => {
  const { rp } = setup(README("\n"));
  assert.equal(run(["--file", join(tmpdir(), "does-not-exist.json"), "--readme", rp]).status, 1);
  assert.equal(readFileSync(rp, "utf8"), README("\n"));
});
test("cli fail closed: README missing", () => {
  const { jp, dir } = setup("x", doc([proj()]));
  assert.equal(run(["--file", jp, "--readme", join(dir, "nope.md")]).status, 1);
});

// fetch path, against a local server standing in for the site
function serve(handler) {
  return new Promise((resolve) => {
    const s = http.createServer(handler).listen(0, "127.0.0.1", () => resolve(s));
  });
}
const runAsync = (args, env) =>
  new Promise((resolve) => {
    const c = spawn(process.execPath, [SCRIPT, ...args], { env: { ...process.env, ...env } });
    c.on("close", (status) => resolve(status));
  });
const urlOf = (s) => `http://127.0.0.1:${s.address().port}/recent.json`;

for (const [name, status, body] of [
  ["404", 404, "{}"],
  ["500", 500, "{}"],
  ["204", 204, ""],
  ["200 non-JSON", 200, "<html>"],
]) {
  test(`cli fail closed: fetch ${name}`, async () => {
    const s = await serve((q, res) => {
      res.statusCode = status;
      res.end(body);
    });
    const { rp } = setup(README("\n"));
    const code = await runAsync(["--readme", rp], { RECENT_URL: urlOf(s) });
    s.close();
    assert.equal(code, 1);
    assert.equal(readFileSync(rp, "utf8"), README("\n"));
  });
}
test("cli fail closed: fetch redirect is refused", async () => {
  const s = await serve((q, res) => {
    res.statusCode = 302;
    res.setHeader("location", "http://127.0.0.1:1/x");
    res.end();
  });
  const { rp } = setup(README("\n"));
  const code = await runAsync(["--readme", rp], { RECENT_URL: urlOf(s) });
  s.close();
  assert.equal(code, 1);
});
test("cli fail closed: connection refused", async () => {
  const { rp } = setup(README("\n"));
  assert.equal(await runAsync(["--readme", rp], { RECENT_URL: "http://127.0.0.1:1/recent.json" }), 1);
});
test("cli: fetch 200 writes the block", async () => {
  const s = await serve((q, res) => {
    res.end(JSON.stringify(doc([proj()])));
  });
  const { rp } = setup(README("\n"));
  const code = await runAsync(["--readme", rp], { RECENT_URL: urlOf(s) });
  s.close();
  assert.equal(code, 0);
  assert.match(readFileSync(rp, "utf8"), /active Oct 2026/);
});

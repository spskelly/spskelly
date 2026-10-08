// Rewrites the "Recently active" block of README.md from the site's recent.json.
//
// Usage (Node 20, no dependencies):
//   node scripts/update-recent.mjs                   fetch RECENT_URL, rewrite README.md
//   node scripts/update-recent.mjs --file path.json  read the JSON from a file (tests)
//   node scripts/update-recent.mjs --readme path.md  rewrite a different README
//
// Exit 0: README updated, or already current. Exit 1: anything wrong, README untouched.
// Only the text between the two markers is ever changed. The README's line endings
// (CRLF or LF) are preserved. The write is tmp file + rename.
//
// Runs weekly from .github/workflows/update-recent.yml.

import { readFileSync, writeFileSync, renameSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const RECENT_URL = "https://shawnskelly.com/recent.json";
export const URL_PREFIX = "https://shawnskelly.com/";
export const START = "<!-- recent:start -->";
export const END = "<!-- recent:end -->";
// Placeholder: the site decides what is public; this only bounds the profile's length.
export const MAX_ITEMS = 6;
export const EMPTY_LINE = "No recent public activity.";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// Characters that could break out of a markdown link label or add markup. Refused, not escaped.
const BAD_TITLE = /[\[\]|<>`\\*_\x00-\x1f\x7f]/;
const BAD_URL = /[\s()<>\[\]`\\\x00-\x1f\x7f]/;

function fail(msg) {
  throw new Error(msg);
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export function validate(json) {
  if (!isPlainObject(json)) fail("recent.json is not an object");
  if (json.schema_version !== 1) fail(`unsupported schema_version: ${String(json.schema_version)}`);
  if (!Array.isArray(json.projects)) fail("projects is not an array");
  if (json.through !== null && typeof json.through !== "string") fail("through must be a string or null");
  json.projects.forEach((p, i) => {
    const at = `projects[${i}]`;
    if (!isPlainObject(p)) fail(`${at} is not an object`);
    const keys = Object.keys(p).sort().join(",");
    if (keys !== "last_active,title,url") fail(`${at} must have exactly title, url, last_active (got ${keys})`);
    if (typeof p.title !== "string" || typeof p.url !== "string" || typeof p.last_active !== "string") {
      fail(`${at} fields must be strings`);
    }
    if (p.title.trim() === "" || p.title !== p.title.trim()) fail(`${at}.title is empty or padded`);
    if (BAD_TITLE.test(p.title)) fail(`${at}.title contains a markdown-breaking character`);
    if (!p.url.startsWith(URL_PREFIX) || p.url.length === URL_PREFIX.length) fail(`${at}.url is not under ${URL_PREFIX}`);
    if (BAD_URL.test(p.url)) fail(`${at}.url contains a forbidden character`);
    const m = /^(\d{4})-(\d{2})$/.exec(p.last_active);
    if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) fail(`${at}.last_active is not YYYY-MM`);
  });
  return json;
}

// Pure. Returns the block body with LF line endings and no trailing newline.
export function renderBlock(json) {
  validate(json);
  if (json.projects.length === 0) return EMPTY_LINE;
  return json.projects
    .slice(0, MAX_ITEMS)
    .map((p) => {
      const [y, mo] = p.last_active.split("-");
      return `- [${p.title}](${p.url}), active ${MONTHS[Number(mo) - 1]} ${y}`;
    })
    .join("\n");
}

function allIndexes(text, needle) {
  const out = [];
  for (let i = text.indexOf(needle); i !== -1; i = text.indexOf(needle, i + needle.length)) out.push(i);
  return out;
}

// Pure. Replaces the text between the markers, keeping the README's own line endings.
export function applyBlock(readme, block) {
  const starts = allIndexes(readme, START);
  const ends = allIndexes(readme, END);
  if (starts.length !== 1) fail(`expected exactly one ${START}, found ${starts.length}`);
  if (ends.length !== 1) fail(`expected exactly one ${END}, found ${ends.length}`);
  if (ends[0] < starts[0]) fail("end marker comes before start marker");
  const eol = readme.includes("\r\n") ? "\r\n" : "\n";
  const body = block.replace(/\r?\n/g, eol);
  return readme.slice(0, starts[0] + START.length) + eol + body + eol + readme.slice(ends[0]);
}

async function loadJson(args) {
  const fi = args.indexOf("--file");
  let raw;
  if (fi !== -1) {
    if (!args[fi + 1]) fail("--file needs a path");
    raw = readFileSync(args[fi + 1], "utf8");
  } else {
    const res = await fetch(process.env.RECENT_URL || RECENT_URL, { redirect: "error" });
    if (res.status !== 200) fail(`fetch returned HTTP ${res.status}`);
    raw = await res.text();
  }
  try {
    return JSON.parse(raw);
  } catch {
    fail("recent.json is not valid JSON");
  }
}

export async function main(args) {
  const ri = args.indexOf("--readme");
  const readmePath = ri !== -1 ? args[ri + 1] : "README.md";
  if (!readmePath) fail("--readme needs a path");
  const json = await loadJson(args);
  const block = renderBlock(json);
  const before = readFileSync(readmePath, "utf8");
  const after = applyBlock(before, block);
  if (after === before) {
    console.log("README already current");
    return;
  }
  const tmp = `${readmePath}.tmp`;
  writeFileSync(tmp, after);
  renameSync(tmp, readmePath);
  console.log("README updated");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e) => {
    console.error(`update-recent: ${e.message}`);
    process.exit(1);
  });
}

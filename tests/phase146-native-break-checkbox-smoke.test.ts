import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("shared checkbox is a native checkbox input instead of a Radix role checkbox", async () => {
  const source = await read("components/ui/checkbox.tsx");
  assert.match(source, /<input[\s\S]*type="checkbox"/);
  assert.match(source, /onChange=\{\(event\) => onCheckedChange\?\.\(event\.target\.checked\)\}/);
  assert.doesNotMatch(source, /role="checkbox"/);
});

test("employee smoke reads the real native break checkbox contract", async () => {
  const source = await read("scripts/employee-browser-ux-smoke.mjs");
  assert.match(source, /input\[type=\\?"checkbox\\?"\]\[aria-label=\\?"وقفه 1 با حقوق\\?"\]/);
  assert.match(source, /checkbox instanceof HTMLInputElement/);
  assert.match(source, /checked: checkbox\.checked/);
  assert.match(source, /checkbox\.checked === false/);
  assert.doesNotMatch(source, /\[role=\\?"checkbox\\?"\]\[aria-label=\\?"وقفه 1 با حقوق\\?"\]/);
  assert.doesNotMatch(source, /getAttribute\("data-state"\)/);
});

test("phase 143 paid-toggle product contract remains intact while the harness follows it", async () => {
  const editor = await read("components/pages/today/time-strip/breaks-editor.tsx");
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  assert.match(editor, /aria-label=\{`وقفه \$\{index \+ 1\} با حقوق`\}/);
  assert.match(editor, /checked=\{Boolean\(item\.paid\)\}/);
  assert.match(smoke, /ensureFirstBreakUnpaid/);
  assert.match(smoke, /Break paid\/unpaid native checkbox not found/);
});
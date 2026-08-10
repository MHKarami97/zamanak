import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");
const todayPage = read("components/pages/today/today-page.tsx");
const editor = read("components/pages/today/completed-day-editor.tsx");
const smoke = read("scripts/employee-browser-ux-smoke.mjs");

test("today editor remounts when a live record becomes completed", () => {
  assert.match(todayPage, /key=\{`\$\{props\.selectedDate\}:\$\{props\.record\.start && props\.record\.end \? "completed" : "active"\}`\}/);
  assert.doesNotMatch(todayPage, /<CompletedDayEditor key=\{props\.selectedDate\}/);
});

test("completed remount starts locked and exposes explicit edit affordance", () => {
  assert.match(editor, /const completed = Boolean\(record\.start && record\.end\)/);
  assert.match(editor, /useState\(!completed\)/);
  assert.match(editor, /completed && !editing && !savedFeedback/);
  assert.match(editor, /ویرایش این روز/);
});

test("employee smoke waits for the completed-day edit control before clicking it", () => {
  assert.match(smoke, /completed employee day edit affordance/);
  assert.match(smoke, /querySelectorAll\("button"\)/);
  assert.match(smoke, /norm\(button\.textContent\) === "ویرایش این روز"/);
  assert.match(smoke, /clickButton\(client, "ویرایش این روز", true\)/);
});
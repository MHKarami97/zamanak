import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { buildEmployeeBreakPersistenceProbeExpression } from "../scripts/employee-persistence-expression.mjs";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("employee controlled text input uses the proven InputEvent contract", async () => {
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  assert.match(smoke, /new InputEvent\("input", \{ bubbles: true, inputType: "insertText", data:/);
  assert.doesNotMatch(smoke, /dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\)/);
});

test("pre-clockout employee persistence probe compiles and checks exact break state", () => {
  const expression = buildEmployeeBreakPersistenceProbeExpression({ date: "2026-08-08" });
  assert.doesNotThrow(() => new Function(`return ${expression};`));
  assert.match(expression, /breakStart/);
  assert.match(expression, /breakEnd/);
  assert.match(expression, /breakUnpaid/);
  assert.match(expression, /15:00/);
  assert.match(expression, /15:15/);
});

test("employee browser journey proves edited break persistence before clock-out and full persistence before net UI", async () => {
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  const breakProbeIndex = smoke.indexOf("waitForEmployeeBreakPersistence(client, date)");
  const clockOutIndex = smoke.indexOf('clickButton(client, "پایان روز", true)');
  const completedProbeIndex = smoke.indexOf("waitForEmployeePersistence(client, date)");
  const netUiIndex = smoke.indexOf('"employee net duration"');
  assert.ok(breakProbeIndex > -1 && clockOutIndex > -1 && breakProbeIndex < clockOutIndex);
  assert.ok(completedProbeIndex > -1 && netUiIndex > -1 && completedProbeIndex < netUiIndex);
});
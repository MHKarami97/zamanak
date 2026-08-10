import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("employee hard reload waits for the rendered textarea instead of innerText note content", async () => {
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  const start = smoke.indexOf('await client.call("Emulation.setDeviceMetricsOverride", { width: 390');
  const end = smoke.indexOf('console.log("✓ Hard reload restores the employee day', start);
  const block = smoke.slice(start, end);
  assert.match(block, /await navigate\(client, `\$\{server\.origin\}\/today`, "یادداشت روز کاری"\)/);
  assert.match(block, /textarea\[placeholder\*="کارهای انجام‌شده"\]/);
  assert.match(block, /note\.value === \$\{JSON\.stringify\(EMPLOYEE_NOTE\)\}/);
  assert.doesNotMatch(block, /navigate\(client, `\$\{server\.origin\}\/today`, EMPLOYEE_NOTE\)/);
});

test("mobile employee contract reads textarea value because form values are not body innerText", async () => {
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  const start = smoke.indexOf("const mobileContract = await evaluate");
  const end = smoke.indexOf("if (!mobileContract", start);
  const block = smoke.slice(start, end);
  assert.match(block, /note instanceof HTMLTextAreaElement && note\.value === \$\{JSON\.stringify\(EMPLOYEE_NOTE\)\}/);
  assert.doesNotMatch(block, /noteVisible:\s*document\.body\?\.innerText\.includes/);
});

test("hard reload still proves completed state and 8:15 after restoring the note", async () => {
  const smoke = await read("scripts/employee-browser-ux-smoke.mjs");
  const start = smoke.indexOf('await navigate(client, `${server.origin}/today`, "یادداشت روز کاری")');
  const end = smoke.indexOf("const mobileContract", start);
  const block = smoke.slice(start, end);
  assert.match(block, /ثبت این روز کامل شده است/);
  assert.match(block, /JSON\.stringify\(NET_DURATION\)/);
  assert.match(block, /employee hard reload state/);
});

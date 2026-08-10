import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("documentation roadmap remains visible in the backlog", async () => {
  const backlog = await read("docs/roadmap/BACKLOG_FA.md");
  assert.match(backlog, /مستندات و معرفی پروژه/);
  assert.match(backlog, /README انگلیسی/);
  assert.match(backlog, /اسکرین‌شات‌های به‌روز/);
});

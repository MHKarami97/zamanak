import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

test("agent entry points expose Persian and English guidance", () => {
  const agents = read("AGENTS.md");
  const docsIndex = read("docs/README.md");

  for (const path of [
    "docs/agents/AGENT_GUIDE_FA.md",
    "docs/agents/AGENT_GUIDE_EN.md",
    "docs/agents/CHANGE_CHECKLISTS.md",
  ]) {
    assert.ok(agents.includes(path), `AGENTS.md must link to ${path}`);
  }

  assert.ok(docsIndex.includes("./agents/AGENT_GUIDE_FA.md"));
  assert.ok(docsIndex.includes("./agents/AGENT_GUIDE_EN.md"));
  assert.ok(docsIndex.includes("./agents/CHANGE_CHECKLISTS.md"));
});

test("repository-standardization backlog entries are closed", () => {
  const backlog = read("docs/roadmap/BACKLOG_FA.md");

  for (const item of [
    "- [x] افزودن قالب Pull Request و Issue",
    "- [x] افزودن راهنمای انگلیسی Agentها",
    "- [x] اضافه‌کردن دستور بررسی خودکار فایل‌های مستندات خارج از مسیر مجاز",
  ]) {
    assert.ok(backlog.includes(item), `backlog must contain ${item}`);
  }
});

test("phase 97 contract test is part of npm test", () => {
  const packageJson = JSON.parse(read("package.json"));
  const testCommand = packageJson.scripts?.test;

  assert.equal(typeof testCommand, "string");
  assert.ok(testCommand.includes("tests/phase96-browser-profile-cleanup.test.ts"));
  assert.ok(testCommand.includes("tests/phase97-repository-standards.test.ts"));
});

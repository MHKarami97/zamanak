import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";
import path from "node:path";

const root = process.cwd();
const read = (file: string) => readFile(path.join(root, file), "utf8");

test("agent guidance documents architecture quality and shadcn policy", async () => {
  const quick = await read("AGENTS.md");
  const guide = await read("docs/agents/AGENT_GUIDE_FA.md");
  assert.match(quick, /npm run check:quality/);
  assert.match(quick, /shadcn\/ui/);
  assert.match(quick, /docs\/phases/);
  assert.match(guide, /npx shadcn@latest add alert-dialog/);
  assert.match(guide, /Migration/);
  assert.match(guide, /Local-first/);
  assert.match(guide, /۲۵۰ خط/);
});

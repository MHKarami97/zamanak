import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workflowPath = new URL("../.github/workflows/deploy-pages.yml", import.meta.url);

async function readWorkflow() {
  return readFile(workflowPath, "utf8");
}

test("CI continues to run on main pushes and pull requests", async () => {
  const workflow = await readWorkflow();
  assert.match(workflow, /push:/);
  assert.match(workflow, /pull_request:/);
  assert.match(workflow, /branches:\s*\["main"\]/);
  assert.match(workflow, /permissions:\s*\n\s*contents:\s*read/);
});

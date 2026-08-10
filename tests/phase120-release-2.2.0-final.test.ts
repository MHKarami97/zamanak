import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { collectReleaseAuditFailures } from "../scripts/release-audit.mjs";

const read = (path: string) => readFileSync(path, "utf8");
const manifest = JSON.parse(read("docs/releases/2.2.0.json")) as Record<string, unknown> & {
  status: string;
  version: string;
  dataSchemaVersion: number;
  verifiedCandidateCommitPrefix: string;
  verifiedCandidateTestCount: number;
  expectedFinalTestCount: number;
  tag: string;
  releaseEvidence: {
    productionBrowserSmoke: string;
    pairingBrowserSmoke: string;
    pairingEncryptedChunks: number;
  };
};
const packageJson = JSON.parse(read("package.json")) as { scripts: Record<string, string> };

test("historical 2.2.0 final manifest remains released on schema v17", () => {
  assert.equal(manifest.version, "2.2.0");
  assert.equal(manifest.status, "released");
  assert.equal(manifest.dataSchemaVersion, 17);
  assert.equal(manifest.tag, "v2.2.0");
});

test("historical final manifest preserves the verified Phase 119 candidate evidence", () => {
  assert.equal(manifest.verifiedCandidateCommitPrefix, "f659456");
  assert.equal(manifest.verifiedCandidateTestCount, 423);
  assert.equal(manifest.expectedFinalTestCount, 429);
  assert.deepEqual(manifest.releaseEvidence, {
    productionBrowserSmoke: "passed",
    pairingBrowserSmoke: "passed",
    pairingEncryptedChunks: 4,
  });
});
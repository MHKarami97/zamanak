import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { collectReleaseAuditFailures } from "../scripts/release-audit.mjs";

const read = (path: string) => readFileSync(path, "utf8");
const manifest = JSON.parse(read("docs/releases/2.3.0.json")) as Record<string, unknown> & {
  version: string;
  status: string;
  dataSchemaVersion: number;
  verifiedCandidateCommitPrefix: string;
  verifiedCandidateTestCount: number;
  expectedFinalTestCount: number;
  tag: string;
  releaseEvidence: {
    productionBrowserSmoke: string;
    freelancerBrowserSmoke: string;
    employeeBrowserSmoke: string;
    pairingBrowserSmoke: string;
    pairingEncryptedChunks: number;
    employeeNetMinutes: number;
  };
};
const packageJson = JSON.parse(read("package.json")) as { scripts: Record<string, string> };

test("historical 2.3.0 final manifest remains released on schema v17", () => {
  assert.equal(manifest.version, "2.3.0");
  assert.equal(manifest.status, "released");
  assert.equal(manifest.dataSchemaVersion, 17);
  assert.equal(manifest.tag, "v2.3.0");
});

test("historical 2.3.0 final manifest preserves the verified Phase 152 gate", () => {
  assert.equal(manifest.verifiedCandidateCommitPrefix, "75b7be6");
  assert.equal(manifest.verifiedCandidateTestCount, 575);
  assert.equal(manifest.expectedFinalTestCount, 581);
});

test("historical 2.3.0 release evidence remains immutable", () => {
  assert.deepEqual(manifest.releaseEvidence, {
    productionBrowserSmoke: "passed",
    freelancerBrowserSmoke: "passed",
    employeeBrowserSmoke: "passed",
    pairingBrowserSmoke: "passed",
    pairingEncryptedChunks: 4,
    employeeNetMinutes: 495,
  });
});
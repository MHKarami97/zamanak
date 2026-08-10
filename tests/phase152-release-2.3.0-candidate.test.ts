import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

const manifest = JSON.parse(read("docs/releases/2.3.0.json")) as {
  version: string;
  releaseDate: string;
  status: string;
  dataSchemaVersion: number;
  nodeEngine: string;
  verifiedCandidateCommitPrefix: string;
  verifiedCandidateTestCount: number;
  expectedFinalTestCount: number;
  browserGate: string;
  freelancerBrowserGate: string;
  employeeBrowserGate: string;
  pairingBrowserGate: string;
  pairingCommand: string;
  releaseNotes: { fa: string; en: string };
  tag: string;
};

test("historical 2.3.0 candidate version Node schema and tag remain immutable", () => {
  assert.equal(manifest.version, "2.3.0");
  assert.equal(manifest.releaseDate, "2026-08-08");
  assert.equal(manifest.nodeEngine, "22.x");
  assert.equal(manifest.dataSchemaVersion, 17);
  assert.equal(manifest.status, "released");
  assert.equal(manifest.tag, "v2.3.0");
});

test("historical 2.3.0 manifest preserves the verified Phase 152 candidate evidence", () => {
  assert.equal(manifest.verifiedCandidateCommitPrefix, "75b7be6");
  assert.equal(manifest.verifiedCandidateTestCount, 575);
  assert.equal(manifest.expectedFinalTestCount, 581);
});

test("historical 2.3.0 keeps every browser gate contract", () => {
  assert.equal(manifest.browserGate, "scripts/production-browser-smoke.mjs");
  assert.equal(manifest.freelancerBrowserGate, "scripts/freelancer-browser-ux-smoke.mjs");
  assert.equal(manifest.employeeBrowserGate, "scripts/employee-browser-ux-smoke.mjs");
  assert.equal(manifest.pairingBrowserGate, "scripts/device-pairing-browser-smoke.mjs");
  assert.equal(manifest.pairingCommand, "npm run test:browser:pairing");
});

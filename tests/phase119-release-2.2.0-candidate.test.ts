import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");
const manifest = JSON.parse(read("docs/releases/2.2.0.json")) as {
  version: string;
  releaseDate: string;
  status: string;
  dataSchemaVersion: number;
  nodeEngine: string;
  verifiedCandidateCommitPrefix: string;
  verifiedCandidateTestCount: number;
  expectedFinalTestCount: number;
  pairingCommand: string;
  pairingBrowserGate: string;
  releaseNotes: { fa: string; en: string };
  tag: string;
};

test("historical 2.2.0 candidate and schema evidence remain immutable after later releases", () => {
  assert.equal(manifest.version, "2.2.0");
  assert.equal(manifest.nodeEngine, "22.x");
  assert.equal(manifest.dataSchemaVersion, 17);
  assert.equal(manifest.status, "released");
  assert.equal(manifest.tag, "v2.2.0");
});

test("2.2.0 candidate gate evidence is preserved historically", () => {
  assert.equal(manifest.verifiedCandidateCommitPrefix, "f659456");
  assert.equal(manifest.verifiedCandidateTestCount, 423);
  assert.equal(manifest.expectedFinalTestCount, 429);
  assert.equal(manifest.pairingCommand, "npm run test:browser:pairing");
  assert.equal(manifest.pairingBrowserGate, "scripts/device-pairing-browser-smoke.mjs");
});

test("2.2.0 preparation and final source phases stay closed in the roadmap", () => {
  const backlog = read("docs/roadmap/BACKLOG_FA.md");
  assert.match(backlog, /- \[x\] فاز ۱۱۹:/);
  assert.match(backlog, /- \[x\] فاز ۱۲۰:/);
  assert.match(backlog, /Tag `v2\.2\.0`/);
});
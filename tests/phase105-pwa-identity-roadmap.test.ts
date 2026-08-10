import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(path, "utf8");

test("PWA install identity uses the approved zamaanak mark and compact app name", () => {
  const manifest = read("app/manifest.ts");
  assert.match(manifest, /name: SITE_NAME,/);
  assert.match(manifest, /short_name: SITE_NAME,/);
  assert.doesNotMatch(manifest, /name: `\$\{SITE_NAME\} — مدیریت زمان و کارکرد`/);
});

test("service worker cache version invalidates stale PWA icon assets", () => {
  const sw = read("public/sw.js");
  const shellVersion = sw.match(/zamaanak-shell-v(\d+)/)?.[1];
  const staticVersion = sw.match(/zamaanak-static-v(\d+)/)?.[1];
  assert.ok(shellVersion);
  assert.equal(shellVersion, staticVersion);
  assert.ok(Number(shellVersion) >= 5);
  assert.match(sw, /icons\/icon-192\.png/);
  assert.match(sw, /icons\/maskable-512\.png/);
});

test("phase 105 contract is part of the main quality command", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.ok(pkg.scripts.test.split(/\s+/).includes("tests/phase105-pwa-identity-roadmap.test.ts"));
});

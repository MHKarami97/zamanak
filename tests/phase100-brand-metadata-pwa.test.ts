import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { ROUTE_METADATA, SITE_DESCRIPTION, SITE_NAME } from "../lib/site-metadata.ts";

const read = (path: string) => readFileSync(path, "utf8");
const packageJson = JSON.parse(read("package.json")) as { scripts: Record<string, string> };

function pngSize(path: string) {
  const buffer = readFileSync(path);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

test("root metadata exposes shareable Persian product identity", () => {
  const layout = read("app/layout.tsx");
  assert.equal(SITE_NAME, "زمانک");
  assert.match(SITE_DESCRIPTION, /ساعت کاری/);
  assert.match(layout, /summary_large_image/);
  assert.match(read("lib/site-metadata.ts"), /zamaanak-social-card\.png/);
  assert.match(layout, /title: \{ default:/);
  assert.match(layout, /manifest\.webmanifest/);
});

test("every product route owns a specific title and description", () => {
  assert.deepEqual(Object.keys(ROUTE_METADATA), ["today", "month", "leave", "reports", "clients", "projects", "invoices", "settings"]);
  for (const [route, metadata] of Object.entries(ROUTE_METADATA)) {
    assert.ok(metadata.title.length > 0);
    assert.ok(metadata.description.length > 20);
    assert.ok(existsSync(`app/${route}/layout.tsx`));
    assert.match(read(`app/${route}/layout.tsx`), new RegExp(`ROUTE_METADATA\\.${route}`));
  }
});

test("the supplied logo is the shared in-app and installable brand mark", () => {
  assert.ok(existsSync("public/brand/zamaanak-mark.svg"));
  assert.ok(existsSync("components/common/brand-mark.tsx"));
  assert.match(read("components/common/brand.tsx"), /BrandMark/);
  assert.match(read("components/zamaanak-shell.tsx"), /BrandMark/);
  assert.doesNotMatch(read("components/common/brand.tsx"), /zamaanak-logo-green/);
  assert.deepEqual(pngSize("public/icons/icon-512.png"), { width: 512, height: 512 });
  assert.deepEqual(pngSize("public/icons/maskable-512.png"), { width: 512, height: 512 });
});

test("phase 100 contract is part of the main quality command", () => {
  assert.ok(packageJson.scripts.test.split(/\s+/).includes("tests/phase100-brand-metadata-pwa.test.ts"));
});

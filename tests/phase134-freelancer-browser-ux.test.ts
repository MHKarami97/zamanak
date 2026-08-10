import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path: string) => fs.readFileSync(path, "utf8");

test("release gate runs the built freelancer browser UX smoke after production smoke", () => {
  const pkg = JSON.parse(read("package.json"));
  assert.match(pkg.scripts["test:browser:freelancer"], /build:vercel/);
  assert.match(pkg.scripts["test:browser:freelancer:built"], /freelancer-browser-ux-smoke\.mjs/);
  assert.match(pkg.scripts["check:release"], /test:browser:production:built.*test:browser:freelancer:built/);
});

test("freelancer browser smoke covers the real client project time expense invoice path", () => {
  const source = read("scripts/freelancer-browser-ux-smoke.mjs");
  for (const marker of ["مشتری مرورگر", "پروژه مرورگر", "شروع تایمر", "هزینه مرورگر", "خدمات مرورگر"]) {
    assert.match(source, new RegExp(marker));
  }
  assert.match(source, /data\.settings\.mode = "freelancer"/);
  assert.match(source, /seedFreelancerData/);
});

test("browser UX smoke exercises keyboard focus validation and mobile viewport contracts", () => {
  const source = read("scripts/freelancer-browser-ux-smoke.mjs");
  assert.match(source, /Input\.dispatchKeyEvent/);
  assert.match(source, /role=.*alert/);
  assert.match(source, /focusTrapped/);
  assert.match(source, /width: 390, height: 844/);
  assert.match(source, /dialogFits/);
});
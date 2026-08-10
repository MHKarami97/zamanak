import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildAppNavigationExpression, buildRouteReadyExpression } from "../scripts/browser-route-expression.mjs";

const read = (path: string) => readFileSync(path, "utf8");

function compileExpression(expression: string) {
  return new Function(`return (${expression});`);
}

test("in-app route discovery normalizes static-export trailing slashes", () => {
  const expression = buildAppNavigationExpression("/projects");
  assert.match(expression, /candidate\.endsWith\("\/"\)/);
  assert.match(expression, /candidate = candidate\.slice\(0, -1\)/);
  assert.match(expression, /candidate === wantedPath/);
  assert.match(expression, /candidate\.endsWith\(wantedPath\)/);
  assert.match(expression, /"\/projects": "پروژه‌ها"/);
  assert.doesNotThrow(() => compileExpression(expression));
});

test("route transition wait accepts both slash and non-slash pathnames", () => {
  const expression = buildRouteReadyExpression("/projects");
  assert.match(expression, /const current = normalize\(location\.pathname\)/);
  assert.match(expression, /const wanted = normalize\("\/projects"\)/);
  assert.match(expression, /current === wanted \|\| \(wanted !== "\/" && current\.endsWith\(wanted\)\)/);
  assert.doesNotThrow(() => compileExpression(expression));
});

test("missing app links report the rendered href and label inventory", () => {
  const expression = buildAppNavigationExpression("/invoices");
  const smoke = read("scripts/freelancer-browser-ux-smoke.mjs");
  assert.match(expression, /available: anchors\.slice\(0, 24\)/);
  assert.match(expression, /href: item\.getAttribute\("href"\)/);
  assert.match(expression, /pathname: normalize\(item\.href\)/);
  assert.match(smoke, /Available anchors:/);
});

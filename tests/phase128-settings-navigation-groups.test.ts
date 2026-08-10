import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("desktop settings navigation groups can expand and collapse without owning active scroll state", async () => {
  const nav = await read("components/pages/settings/settings-nav.tsx");
  assert.match(nav, /groupOverrides/);
  assert.match(nav, /aria-expanded=\{isOpen\}/);
  assert.match(nav, /toggleGroup/);
  assert.match(nav, /const isOpen = groupOverrides\[group\.id\] \?\? isActiveGroup/);
  assert.match(nav, /useSyncExternalStore\(subscribeToSettingsPosition/);
  assert.doesNotMatch(nav, /setActive/);
});

test("mobile settings navigation exposes group chips and only the active group item strip", async () => {
  const nav = await read("components/pages/settings/settings-nav.tsx");
  assert.match(nav, /aria-pressed=\{isActiveGroup\}/);
  assert.match(nav, /navigateToGroup/);
  assert.match(nav, /getSettingsGroupItems\(activeGroup\)\.map/);
  assert.match(nav, /max-\[900px\]:grid/);
});

test("settings navigation model exposes typed group helpers", async () => {
  const model = await read("components/pages/settings/settings-navigation-model.ts");
  assert.match(model, /export type SettingsNavGroupId/);
  assert.match(model, /getSettingsGroupId/);
  assert.match(model, /getSettingsGroupItems/);
  assert.match(model, /settings-device-transfer/);
});

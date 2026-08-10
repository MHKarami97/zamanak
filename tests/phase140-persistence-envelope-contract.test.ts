import assert from "node:assert/strict";
import test from "node:test";
import { buildFreelancerPersistenceProbeExpression } from "../scripts/freelancer-persistence-expression.mjs";

const params = {
  clientName: "مشتری مرورگر",
  projectName: "پروژه مرورگر",
  expenseName: "هزینه مرورگر",
  invoiceDescription: "خدمات مرورگر",
};

test("freelancer persistence probe compiles before CDP evaluation", () => {
  const expression = buildFreelancerPersistenceProbeExpression(params);
  assert.doesNotThrow(() => new Function(`return (${expression});`));
});

test("persistence probe unwraps the real AppData snapshot envelope", () => {
  const expression = buildFreelancerPersistenceProbeExpression(params);
  assert.match(expression, /stored\.format === "zamaanak-app-data"/);
  assert.match(expression, /const data = envelope \? envelope\.data : stored/);
  assert.match(expression, /schemaVersion: envelope\?\.schemaVersion/);
});

test("invoice durability follows the current lines contract instead of obsolete items", () => {
  const expression = buildFreelancerPersistenceProbeExpression(params);
  assert.match(expression, /item\.lines\?\.some/);
  assert.doesNotMatch(expression, /item\.items/);
  assert.match(expression, /timeEntries/);
  assert.match(expression, /expenses/);
  assert.match(expression, /invoices/);
});
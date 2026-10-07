import test from "node:test";
import assert from "node:assert/strict";

import { buildTable } from "../scripts/tablize-api-members.mjs";
import { lexicalBindings, repeatedTableLoops } from "../scripts/check-code-shape.mjs";
import { maskSource } from "../scripts/source-shape.mjs";

const member = (name) => ({
  name,
  factory: "descriptor",
  argsList: [JSON.stringify(name)],
});

test("canvas member tables preserve their original installation segments", async () => {
  const { pathCommandPart1Table, pathCommandPart2Table, pathCommandPart3Table } =
    await import("../src/surface/api/canvas/path-command-members.js");
  const { textMetricsNumberGetterPart1Table, textMetricsNumberGetterPart2Table } =
    await import("../src/surface/api/canvas/text-metrics-number-getter-members.js");
  assert.deepEqual(pathCommandPart1Table.map(([name]) => name), ["roundRect"]);
  assert.deepEqual(pathCommandPart2Table.map(([name]) => name), ["bezierCurveTo", "closePath"]);
  assert.deepEqual(pathCommandPart3Table.map(([name]) => name), [
    "lineTo",
    "moveTo",
    "quadraticCurveTo",
    "rect",
  ]);
  assert.deepEqual(textMetricsNumberGetterPart1Table.map(([name]) => name), ["width"]);
  assert.deepEqual(textMetricsNumberGetterPart2Table.map(([name]) => name), ["hangingBaseline"]);
});
test("member tables preserve duplicate separated installation segments", () => {
  const first = buildTable("descriptorPart1Table", [member("first")]);
  const second = buildTable("descriptorPart2Table", [member("second")]);
  assert.match(first, /DESCRIPTOR_PART1_TABLE_ROWS/);
  assert.match(second, /DESCRIPTOR_PART2_TABLE_ROWS/);
  assert.doesNotMatch(first, /second/);
  assert.doesNotMatch(second, /first/);
});

test("repeated table loops are rejected within one function", () => {
  const source = `
    import { firstTable, secondTable } from "./members.js";
    function install() {
      for (const [name, entry] of firstTable) installOne(name, entry);
      for (const [name, entry] of secondTable) installOne(name, entry);
      for (const [name, entry] of firstTable) installOne(name, entry);
    }
  `;
  const repeated = repeatedTableLoops(maskSource(source));
  assert.deepEqual(repeated.map(({ table, count }) => ({ table, count })), [
    { table: "firstTable", count: 2 },
  ]);
  assert.deepEqual(repeatedTableLoops(maskSource(`
    function install() {
      for (const [name, entry] of firstPartTable) installOne(name, entry);
      for (const [name, entry] of secondPartTable) installOne(name, entry);
    }
  `)), []);
});

test("table binding checks respect lexical scope", () => {
  const source = `
    import { outerTable } from "./outer.js";
    function valid() { for (const entry of outerTable) {} }
    function invalid() { for (const entry of innerTable) {} }
    function other() { const innerTable = []; for (const entry of innerTable) {} }
  `;
  const bindings = lexicalBindings(maskSource(source));
  assert.equal(bindings.hasBinding("outerTable", source.indexOf("outerTable)")), true);
  assert.equal(bindings.hasBinding("innerTable", source.indexOf("innerTable)")), false);
  const localUse = source.lastIndexOf("innerTable)");
  assert.equal(bindings.hasBinding("innerTable", localUse), true);
});

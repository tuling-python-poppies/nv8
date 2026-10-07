import test from "node:test";
import assert from "node:assert/strict";

import { buildTable } from "../scripts/tablize-api-members.mjs";
import { lexicalBindings } from "../scripts/check-code-shape.mjs";
import { maskSource } from "../scripts/source-shape.mjs";

const member = (name) => ({
  name,
  factory: "descriptor",
  argsList: [JSON.stringify(name)],
});

test("member tables preserve duplicate separated installation segments", () => {
  const first = buildTable("descriptorPart1Table", [member("first")]);
  const second = buildTable("descriptorPart2Table", [member("second")]);
  assert.match(first, /DESCRIPTOR_PART1_TABLE_ROWS/);
  assert.match(second, /DESCRIPTOR_PART2_TABLE_ROWS/);
  assert.doesNotMatch(first, /second/);
  assert.doesNotMatch(second, /first/);
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

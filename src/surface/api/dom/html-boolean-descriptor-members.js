// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlBooleanDescriptor } from "./html-element-property.js";

const HTML_BOOLEAN_DESCRIPTOR_PART1_TABLE_ROWS = [
  ["hidden", "hidden", false],
  ["inert", "inert", false],
  ["draggable", "draggable", false],
  ["spellcheck", "spellcheck", true],
  ["autofocus", "autofocus", false],
];

export const htmlBooleanDescriptorPart1Table = HTML_BOOLEAN_DESCRIPTOR_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlBooleanDescriptor(...args)],
);

const HTML_BOOLEAN_DESCRIPTOR_PART2_TABLE_ROWS = [
  ["autofocus", "autofocus", false],
];

export const htmlBooleanDescriptorPart2Table = HTML_BOOLEAN_DESCRIPTOR_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlBooleanDescriptor(...args)],
);

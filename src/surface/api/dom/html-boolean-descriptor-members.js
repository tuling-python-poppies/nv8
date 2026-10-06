// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlBooleanDescriptor } from "./html-element-property.js";

const HTML_BOOLEAN_DESCRIPTOR_TABLE_ROWS = [
  ["autofocus", "autofocus", false],
  ["draggable", "draggable", false],
  ["hidden", "hidden", false],
  ["inert", "inert", false],
  ["spellcheck", "spellcheck", true],
];

export const htmlBooleanDescriptorTable = HTML_BOOLEAN_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlBooleanDescriptor(...args)],
);


// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlStateDescriptor } from "./html-element-property.js";

const HTML_STATE_DESCRIPTOR_TABLE_ROWS = [
  ["editContext", "editContext", null, value => (
    (typeof value === "object" && value !== null)
      || typeof value === "function"
  ) ? value : null],
];

export const htmlStateDescriptorTable = HTML_STATE_DESCRIPTOR_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlStateDescriptor(...args)],
);

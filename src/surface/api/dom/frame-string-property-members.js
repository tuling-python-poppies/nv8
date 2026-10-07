// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { frameStringProperty } from "./html-frame-element-string-property.js";

const FRAME_STRING_PROPERTY_PART1_TABLE_ROWS = [
  ["name", "name", "name"],
  ["scrolling", "scrolling", "scrolling"],
  ["src", "src", "src"],
  ["frameBorder", "frameBorder", "frameborder"],
  ["longDesc", "longDesc", "longdesc"],
];

export const frameStringPropertyPart1Table = FRAME_STRING_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameStringProperty(...args)],
);

const FRAME_STRING_PROPERTY_PART2_TABLE_ROWS = [
  ["marginHeight", "marginHeight", "marginheight"],
  ["marginWidth", "marginWidth", "marginwidth"],
];

export const frameStringPropertyPart2Table = FRAME_STRING_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameStringProperty(...args)],
);

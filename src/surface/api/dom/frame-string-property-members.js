// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { frameStringProperty } from "./html-frame-element-string-property.js";

const FRAME_STRING_PROPERTY_TABLE_ROWS = [
  ["frameBorder", "frameBorder", "frameborder"],
  ["longDesc", "longDesc", "longdesc"],
  ["marginHeight", "marginHeight", "marginheight"],
  ["marginWidth", "marginWidth", "marginwidth"],
  ["name", "name", "name"],
  ["scrolling", "scrolling", "scrolling"],
  ["src", "src", "src"],
];

export const frameStringPropertyTable = FRAME_STRING_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameStringProperty(...args)],
);


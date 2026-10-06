// geometry 的成员表：名字就能描述实现，不再一个成员一个文件。

import { rectGetter } from "./dom-rect-property.js";

const RECT_GETTER_TABLE_ROWS = [
  ["bottom", "bottom", s => Math.max(s.y, s.y + s.height)],
  ["height", "height"],
  ["left", "left", s => Math.min(s.x, s.x + s.width)],
  ["right", "right", s => Math.max(s.x, s.x + s.width)],
  ["top", "top", s => Math.min(s.y, s.y + s.height)],
  ["width", "width"],
  ["x", "x"],
  ["y", "y"],
];

export const rectGetterTable = RECT_GETTER_TABLE_ROWS.map(
  ([name, ...args]) => [name, rectGetter(...args)],
);


// canvas 的成员表：名字就能描述实现，不再一个成员一个文件。

import { htmlCanvasDimensionProperty } from "./html-canvas-element-property.js";

const HTML_CANVAS_DIMENSION_PROPERTY_TABLE_ROWS = [
  ["height"],
  ["width"],
];

export const htmlCanvasDimensionPropertyTable = HTML_CANVAS_DIMENSION_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, htmlCanvasDimensionProperty(name, ...args)],
);


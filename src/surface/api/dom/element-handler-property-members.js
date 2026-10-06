// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementHandlerProperty } from "./element-extended-property.js";

const ELEMENT_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onbeforecopy", "onbeforecopy"],
  ["onbeforecut", "onbeforecut"],
  ["onbeforepaste", "onbeforepaste"],
  ["onfullscreenchange", "onfullscreenchange"],
  ["onfullscreenerror", "onfullscreenerror"],
  ["onsearch", "onsearch"],
  ["onwebkitfullscreenchange", "onwebkitfullscreenchange"],
  ["onwebkitfullscreenerror", "onwebkitfullscreenerror"],
];

export const elementHandlerPropertyTable = ELEMENT_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementHandlerProperty(...args)],
);


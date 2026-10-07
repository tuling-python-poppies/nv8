// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { elementHandlerProperty } from "./element-extended-property.js";

const ELEMENT_HANDLER_PROPERTY_PART1_TABLE_ROWS = [
  ["onbeforecopy", "onbeforecopy"],
  ["onbeforecut", "onbeforecut"],
  ["onbeforepaste", "onbeforepaste"],
  ["onsearch", "onsearch"],
];

export const elementHandlerPropertyPart1Table = ELEMENT_HANDLER_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementHandlerProperty(...args)],
);

const ELEMENT_HANDLER_PROPERTY_PART2_TABLE_ROWS = [
  ["onfullscreenchange", "onfullscreenchange"],
  ["onfullscreenerror", "onfullscreenerror"],
];

export const elementHandlerPropertyPart2Table = ELEMENT_HANDLER_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementHandlerProperty(...args)],
);

const ELEMENT_HANDLER_PROPERTY_PART3_TABLE_ROWS = [
  ["onwebkitfullscreenchange", "onwebkitfullscreenchange"],
  ["onwebkitfullscreenerror", "onwebkitfullscreenerror"],
];

export const elementHandlerPropertyPart3Table = ELEMENT_HANDLER_PROPERTY_PART3_TABLE_ROWS.map(
  ([name, ...args]) => [name, elementHandlerProperty(...args)],
);

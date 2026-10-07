// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";

const FRAME_SET_HANDLER_PROPERTY_PART1_TABLE_ROWS = [
  ["onblur", "onblur"],
  ["onerror", "onerror"],
  ["onfocus", "onfocus"],
  ["onload", "onload"],
  ["onresize", "onresize"],
  ["onscroll", "onscroll"],
  ["onafterprint", "onafterprint"],
  ["onbeforeprint", "onbeforeprint"],
  ["onbeforeunload", "onbeforeunload"],
  ["onhashchange", "onhashchange"],
  ["onlanguagechange", "onlanguagechange"],
  ["onmessage", "onmessage"],
  ["onmessageerror", "onmessageerror"],
  ["onoffline", "onoffline"],
  ["ononline", "ononline"],
  ["onpagehide", "onpagehide"],
  ["onpageshow", "onpageshow"],
  ["onpopstate", "onpopstate"],
  ["onrejectionhandled", "onrejectionhandled"],
  ["onstorage", "onstorage"],
  ["onunhandledrejection", "onunhandledrejection"],
  ["onunload", "onunload"],
  ["ongamepadconnected", "ongamepadconnected"],
];

export const frameSetHandlerPropertyPart1Table = FRAME_SET_HANDLER_PROPERTY_PART1_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameSetHandlerProperty(...args)],
);

const FRAME_SET_HANDLER_PROPERTY_PART2_TABLE_ROWS = [
  ["ongamepaddisconnected", "ongamepaddisconnected"],
];

export const frameSetHandlerPropertyPart2Table = FRAME_SET_HANDLER_PROPERTY_PART2_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameSetHandlerProperty(...args)],
);

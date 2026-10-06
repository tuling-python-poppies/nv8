// dom 的成员表：名字就能描述实现，不再一个成员一个文件。

import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";

const FRAME_SET_HANDLER_PROPERTY_TABLE_ROWS = [
  ["onafterprint", "onafterprint"],
  ["onbeforeprint", "onbeforeprint"],
  ["onbeforeunload", "onbeforeunload"],
  ["onblur", "onblur"],
  ["onerror", "onerror"],
  ["onfocus", "onfocus"],
  ["ongamepadconnected", "ongamepadconnected"],
  ["ongamepaddisconnected", "ongamepaddisconnected"],
  ["onhashchange", "onhashchange"],
  ["onlanguagechange", "onlanguagechange"],
  ["onload", "onload"],
  ["onmessage", "onmessage"],
  ["onmessageerror", "onmessageerror"],
  ["onoffline", "onoffline"],
  ["ononline", "ononline"],
  ["onpagehide", "onpagehide"],
  ["onpageshow", "onpageshow"],
  ["onpopstate", "onpopstate"],
  ["onrejectionhandled", "onrejectionhandled"],
  ["onresize", "onresize"],
  ["onscroll", "onscroll"],
  ["onstorage", "onstorage"],
  ["onunhandledrejection", "onunhandledrejection"],
  ["onunload", "onunload"],
];

export const frameSetHandlerPropertyTable = FRAME_SET_HANDLER_PROPERTY_TABLE_ROWS.map(
  ([name, ...args]) => [name, frameSetHandlerProperty(...args)],
);


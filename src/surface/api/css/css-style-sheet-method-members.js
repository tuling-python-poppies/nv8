// css 的成员表：名字就能描述实现，不再一个成员一个文件。

import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import {
  deleteCSSStyleSheetRule,
  insertCSSStyleSheetRule,
  replaceCSSStyleSheetRules,
} from "./css-style-sheet-state.js";

const CSS_STYLE_SHEET_METHOD_TABLE_ROWS = [
  ["deleteRule", "deleteRule", 1, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0])],
  ["insertRule", "insertRule", 1, (sheet, args) =>
  insertCSSStyleSheetRule(sheet, args[0], args[1] === undefined ? 0 : args[1])],
  ["removeRule", "removeRule", 0, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0] === undefined ? 0 : args[0])],
  ["replaceSync", "replaceSync", 1, (sheet, args) =>
  replaceCSSStyleSheetRules(sheet, args[0])],
];

export const cssStyleSheetMethodTable = CSS_STYLE_SHEET_METHOD_TABLE_ROWS.map(
  ([name, ...args]) => [name, cssStyleSheetMethod(...args)],
);


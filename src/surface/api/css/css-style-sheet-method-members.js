// css 目录的成员实现：原本一个成员一个文件，合并以减少模块图节点。

import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import {
  deleteCSSStyleSheetRule,
  insertCSSStyleSheetRule,
  replaceCSSStyleSheetRules,
} from "./css-style-sheet-state.js";

export const deleteRule = cssStyleSheetMethod("deleteRule", 1, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0]));
export const insertRule = cssStyleSheetMethod("insertRule", 1, (sheet, args) =>
  insertCSSStyleSheetRule(sheet, args[0], args[1] === undefined ? 0 : args[1]));
export const removeRule = cssStyleSheetMethod("removeRule", 0, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0] === undefined ? 0 : args[0]));
export const replaceSync = cssStyleSheetMethod("replaceSync", 1, (sheet, args) =>
  replaceCSSStyleSheetRules(sheet, args[0]));

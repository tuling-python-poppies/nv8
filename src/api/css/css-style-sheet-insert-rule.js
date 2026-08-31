import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { insertCSSStyleSheetRule } from "./css-style-sheet-state.js";
export const insertRule = cssStyleSheetMethod("insertRule", 1, (sheet, args) =>
  insertCSSStyleSheetRule(sheet, args[0], args[1] === undefined ? 0 : args[1]));

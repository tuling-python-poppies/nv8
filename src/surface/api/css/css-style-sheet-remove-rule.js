import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { deleteCSSStyleSheetRule } from "./css-style-sheet-state.js";
export const removeRule = cssStyleSheetMethod("removeRule", 0, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0] === undefined ? 0 : args[0]));

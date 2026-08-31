import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { deleteCSSStyleSheetRule } from "./css-style-sheet-state.js";
export const deleteRule = cssStyleSheetMethod("deleteRule", 1, (sheet, args) =>
  deleteCSSStyleSheetRule(sheet, args[0]));

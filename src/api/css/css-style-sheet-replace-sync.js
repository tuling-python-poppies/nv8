import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { replaceCSSStyleSheetRules } from "./css-style-sheet-state.js";
export const replaceSync = cssStyleSheetMethod("replaceSync", 1, (sheet, args) =>
  replaceCSSStyleSheetRules(sheet, args[0]));

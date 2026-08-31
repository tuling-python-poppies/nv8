import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { replaceCSSStyleSheetRules } from "./css-style-sheet-state.js";
export const replace = cssStyleSheetMethod("replace", 1, (sheet, args) => {
  replaceCSSStyleSheetRules(sheet, args[0]);
  return Promise.resolve(sheet);
});

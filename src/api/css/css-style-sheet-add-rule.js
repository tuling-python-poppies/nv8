import { cssStyleSheetMethod } from "./css-style-sheet-method.js";
import { insertCSSStyleSheetRule, requireCSSStyleSheet } from "./css-style-sheet-state.js";
export const addRule = cssStyleSheetMethod("addRule", 0, (sheet, args) => {
  const record = requireCSSStyleSheet(sheet);
  const index = args[2] === undefined ? record.rules.length : Number(args[2]) >>> 0;
  insertCSSStyleSheetRule(sheet, `${args[0]} { ${args[1] ?? ""} }`, index);
  return -1;
});

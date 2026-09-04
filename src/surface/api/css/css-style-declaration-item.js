import { cssStyleMethod } from "./css-style-declaration-method.js";
import { readCSSDeclarations } from "./css-style-declaration-state.js";

export const item = cssStyleMethod("item", 1, (declaration, args) => {
  const index = Number(args[0]) >>> 0;
  return [...readCSSDeclarations(declaration).keys()][index] ?? "";
});

import { cssStyleMethod } from "./css-style-declaration-method.js";
import { normalizeCSSPropertyName, readCSSDeclarations } from "./css-style-declaration-state.js";

export const getPropertyPriority = cssStyleMethod(
  "getPropertyPriority",
  1,
  (declaration, args) =>
    readCSSDeclarations(declaration).get(normalizeCSSPropertyName(args[0]))?.priority ?? "",
);

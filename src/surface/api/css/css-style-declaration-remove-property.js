import { cssStyleMethod } from "./css-style-declaration-method.js";
import {
  normalizeCSSPropertyName,
  readCSSDeclarations,
  writeCSSDeclarations,
} from "./css-style-declaration-state.js";

export const removeProperty = cssStyleMethod("removeProperty", 1, (declaration, args) => {
  const declarations = readCSSDeclarations(declaration);
  const name = normalizeCSSPropertyName(args[0]);
  const previous = declarations.get(name)?.value ?? "";
  declarations.delete(name);
  writeCSSDeclarations(declaration, declarations);
  return previous;
});

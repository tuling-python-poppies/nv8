import { cssStyleMethod } from "./css-style-declaration-method.js";
import {
  normalizeCSSPropertyName,
  readCSSDeclarations,
  writeCSSDeclarations,
} from "./css-style-declaration-state.js";

export const setProperty = cssStyleMethod("setProperty", 2, (declaration, args) => {
  const name = normalizeCSSPropertyName(args[0]);
  if (name === "") return;
  const value = `${args[1] ?? ""}`.trim();
  const priority = `${args[2] ?? ""}`.trim().toLowerCase();
  if (priority !== "" && priority !== "important") return;
  const declarations = readCSSDeclarations(declaration);
  if (value === "") declarations.delete(name);
  else declarations.set(name, { value, priority });
  writeCSSDeclarations(declaration, declarations);
});

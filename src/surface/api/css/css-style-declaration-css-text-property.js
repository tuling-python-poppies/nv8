import { cssStyleAccessorDescriptor } from "./css-style-declaration-property.js";
import {
  parseCSSDeclarations,
  readCSSDeclarations,
  serializeCSSDeclarations,
  writeCSSDeclarations,
} from "./css-style-declaration-state.js";

const descriptor = cssStyleAccessorDescriptor(
  "cssText",
  declaration => serializeCSSDeclarations(readCSSDeclarations(declaration)),
  (declaration, value) => writeCSSDeclarations(declaration, parseCSSDeclarations(value)),
);
export const cssText = descriptor;

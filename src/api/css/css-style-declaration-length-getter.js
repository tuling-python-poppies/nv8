import { cssStyleReadonlyDescriptor } from "./css-style-declaration-property.js";
import { readCSSDeclarations } from "./css-style-declaration-state.js";

export const length = cssStyleReadonlyDescriptor(
  "length",
  declaration => readCSSDeclarations(declaration).size,
).get;

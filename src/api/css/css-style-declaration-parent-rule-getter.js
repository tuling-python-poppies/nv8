import { cssStyleReadonlyDescriptor } from "./css-style-declaration-property.js";
import { requireCSSStyleDeclaration } from "./css-style-declaration-state.js";

export const parentRule = cssStyleReadonlyDescriptor("parentRule", declaration => {
  return requireCSSStyleDeclaration(declaration).parentRule;
}).get;

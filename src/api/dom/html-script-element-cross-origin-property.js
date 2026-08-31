import { nullableStringReflection } from "./html-reflection.js";

const descriptor = nullableStringReflection(
  "HTMLScriptElement",
  "crossOrigin",
  "crossorigin",
);
export const crossOrigin = descriptor.get;
export const setCrossOrigin = descriptor.set;

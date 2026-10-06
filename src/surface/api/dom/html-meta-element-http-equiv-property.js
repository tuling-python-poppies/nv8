import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection(
  "HTMLMetaElement",
  "httpEquiv",
  "http-equiv",
);
export const httpEquiv = descriptor.get;
export const setHttpEquiv = descriptor.set;

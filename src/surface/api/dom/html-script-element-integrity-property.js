import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection(
  "HTMLScriptElement",
  "integrity",
  "integrity",
);
export const integrity = descriptor.get;
export const setIntegrity = descriptor.set;

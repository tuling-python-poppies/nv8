import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection(
  "HTMLOListElement",
  "reversed",
  "reversed",
);
export const reversed = descriptor.get;
export const setReversed = descriptor.set;

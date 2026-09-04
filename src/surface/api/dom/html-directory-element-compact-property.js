import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection(
  "HTMLDirectoryElement",
  "compact",
  "compact",
);
export const compact = descriptor.get;
export const setCompact = descriptor.set;

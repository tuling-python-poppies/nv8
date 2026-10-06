import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection(
  "HTMLScriptElement",
  "fetchPriority",
  "fetchpriority",
);
export const fetchPriority = descriptor.get;
export const setFetchPriority = descriptor.set;

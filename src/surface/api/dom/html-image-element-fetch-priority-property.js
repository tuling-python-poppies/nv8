import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "fetchPriority", "fetchpriority");
export const fetchPriority = descriptor.get;
export const setFetchPriority = descriptor.set;

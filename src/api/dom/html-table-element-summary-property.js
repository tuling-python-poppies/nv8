import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "summary", "summary");
export const summary = descriptor.get;
export const setSummary = descriptor.set;

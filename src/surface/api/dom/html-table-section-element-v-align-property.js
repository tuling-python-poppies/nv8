import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableSectionElement", "vAlign", "valign");
export const vAlign = descriptor.get;
export const setVAlign = descriptor.set;

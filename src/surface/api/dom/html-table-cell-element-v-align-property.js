import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "vAlign", "valign");
export const vAlign = descriptor.get;
export const setVAlign = descriptor.set;

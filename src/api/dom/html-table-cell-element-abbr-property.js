import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "abbr", "abbr");
export const abbr = descriptor.get;
export const setAbbr = descriptor.set;

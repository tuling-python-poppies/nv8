import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "scope", "scope");
export const scope = descriptor.get;
export const setScope = descriptor.set;

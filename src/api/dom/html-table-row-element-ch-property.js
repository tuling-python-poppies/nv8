import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableRowElement", "ch", "char");
export const ch = descriptor.get;
export const setCh = descriptor.set;

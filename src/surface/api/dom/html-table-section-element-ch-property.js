import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableSectionElement", "ch", "char");
export const ch = descriptor.get;
export const setCh = descriptor.set;

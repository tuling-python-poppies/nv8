import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableSectionElement", "chOff", "charoff");
export const chOff = descriptor.get;
export const setChOff = descriptor.set;

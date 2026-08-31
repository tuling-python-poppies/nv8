import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableRowElement", "chOff", "charoff");
export const chOff = descriptor.get;
export const setChOff = descriptor.set;

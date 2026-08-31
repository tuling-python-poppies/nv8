import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

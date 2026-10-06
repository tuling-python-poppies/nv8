import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "height", "height");
export const height = descriptor.get;
export const setHeight = descriptor.set;

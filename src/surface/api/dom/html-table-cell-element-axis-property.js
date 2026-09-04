import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "axis", "axis");
export const axis = descriptor.get;
export const setAxis = descriptor.set;

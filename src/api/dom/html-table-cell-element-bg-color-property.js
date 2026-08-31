import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "bgColor", "bgcolor");
export const bgColor = descriptor.get;
export const setBgColor = descriptor.set;

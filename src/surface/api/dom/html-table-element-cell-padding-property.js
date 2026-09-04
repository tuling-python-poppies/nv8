import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "cellPadding", "cellpadding");
export const cellPadding = descriptor.get;
export const setCellPadding = descriptor.set;

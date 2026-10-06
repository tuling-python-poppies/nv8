import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "cellSpacing", "cellspacing");
export const cellSpacing = descriptor.get;
export const setCellSpacing = descriptor.set;

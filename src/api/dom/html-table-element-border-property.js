import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "border", "border");
export const border = descriptor.get;
export const setBorder = descriptor.set;

import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "border", "border");
export const border = descriptor.get;
export const setBorder = descriptor.set;

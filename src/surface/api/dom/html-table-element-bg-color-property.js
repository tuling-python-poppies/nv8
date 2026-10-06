import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "bgColor", "bgcolor");
export const bgColor = descriptor.get;
export const setBgColor = descriptor.set;

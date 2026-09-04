import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableRowElement", "bgColor", "bgcolor");
export const bgColor = descriptor.get;
export const setBgColor = descriptor.set;

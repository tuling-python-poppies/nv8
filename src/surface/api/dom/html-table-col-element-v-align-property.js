import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLTableColElement", "vAlign", "valign");
export const vAlign = descriptor.get;
export const setVAlign = descriptor.set;

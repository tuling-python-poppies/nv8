import { textAreaNumberReflection } from "./html-text-area-element-number-reflection.js";
const descriptor = textAreaNumberReflection("cols", "cols", 20, true);
export const cols = descriptor.get;
export const setCols = descriptor.set;

import { textAreaNumberReflection } from "./html-text-area-element-number-reflection.js";
const descriptor = textAreaNumberReflection("rows", "rows", 2, true);
export const rows = descriptor.get;
export const setRows = descriptor.set;

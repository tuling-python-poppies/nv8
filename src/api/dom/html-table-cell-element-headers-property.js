import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableCellElement", "headers", "headers");
export const headers = descriptor.get;
export const setHeaders = descriptor.set;

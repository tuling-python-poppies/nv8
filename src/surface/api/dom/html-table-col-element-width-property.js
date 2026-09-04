import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLTableColElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

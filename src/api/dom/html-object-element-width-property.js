import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

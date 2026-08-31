import { unsignedReflection } from "./html-reflection.js";
const descriptor = unsignedReflection("HTMLImageElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

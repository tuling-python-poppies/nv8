import { unsignedReflection } from "./html-reflection.js";

const descriptor = unsignedReflection("HTMLSourceElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

import { unsignedReflection } from "./html-reflection.js";
const descriptor = unsignedReflection("HTMLImageElement", "height", "height");
export const height = descriptor.get;
export const setHeight = descriptor.set;

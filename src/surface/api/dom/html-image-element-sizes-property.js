import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "sizes", "sizes");
export const sizes = descriptor.get;
export const setSizes = descriptor.set;

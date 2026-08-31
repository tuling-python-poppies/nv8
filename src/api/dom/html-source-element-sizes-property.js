import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLSourceElement", "sizes", "sizes");
export const sizes = descriptor.get;
export const setSizes = descriptor.set;

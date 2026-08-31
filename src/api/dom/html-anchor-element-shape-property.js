import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "shape", "shape");
export const shape = descriptor.get;
export const setShape = descriptor.set;

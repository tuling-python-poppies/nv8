import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "shape", "shape");
export const shape = descriptor.get;
export const setShape = descriptor.set;

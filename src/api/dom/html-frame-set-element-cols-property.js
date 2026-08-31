import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLFrameSetElement", "cols", "cols");
export const cols = descriptor.get;
export const setCols = descriptor.set;

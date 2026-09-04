import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "frame", "frame");
export const frame = descriptor.get;
export const setFrame = descriptor.set;

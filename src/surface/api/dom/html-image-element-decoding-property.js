import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "decoding", "decoding");
export const decoding = descriptor.get;
export const setDecoding = descriptor.set;

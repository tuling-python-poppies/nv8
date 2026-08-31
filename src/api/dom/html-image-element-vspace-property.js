import { unsignedReflection } from "./html-reflection.js";
const descriptor = unsignedReflection("HTMLImageElement", "vspace", "vspace");
export const vspace = descriptor.get;
export const setVspace = descriptor.set;

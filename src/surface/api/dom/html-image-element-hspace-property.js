import { unsignedReflection } from "./html-reflection.js";
const descriptor = unsignedReflection("HTMLImageElement", "hspace", "hspace");
export const hspace = descriptor.get;
export const setHspace = descriptor.set;

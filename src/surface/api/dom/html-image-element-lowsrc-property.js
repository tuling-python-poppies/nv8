import { urlReflection } from "./html-reflection.js";
const descriptor = urlReflection("HTMLImageElement", "lowsrc", "lowsrc");
export const lowsrc = descriptor.get;
export const setLowsrc = descriptor.set;

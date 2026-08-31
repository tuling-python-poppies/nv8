import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "as", "as");
export const as = descriptor.get;
export const setAs = descriptor.set;

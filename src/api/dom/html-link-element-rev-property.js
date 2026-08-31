import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "rev", "rev");
export const rev = descriptor.get;
export const setRev = descriptor.set;

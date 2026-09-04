import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "rel", "rel");
export const rel = descriptor.get;
export const setRel = descriptor.set;

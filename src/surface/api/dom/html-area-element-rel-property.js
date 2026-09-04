import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "rel", "rel");
export const rel = descriptor.get;
export const setRel = descriptor.set;

import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "type", "type");
export const type = descriptor.get;
export const setType = descriptor.set;

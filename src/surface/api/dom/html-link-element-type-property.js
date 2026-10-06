import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "type", "type");
export const type = descriptor.get;
export const setType = descriptor.set;

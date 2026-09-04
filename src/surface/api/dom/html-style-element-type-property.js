import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLStyleElement", "type", "type");
export const type = descriptor.get;
export const setType = descriptor.set;

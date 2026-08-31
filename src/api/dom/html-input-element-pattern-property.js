import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "pattern", "pattern");
export const pattern = descriptor.get;
export const setPattern = descriptor.set;

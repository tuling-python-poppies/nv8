import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "alt", "alt");
export const alt = descriptor.get;
export const setAlt = descriptor.set;

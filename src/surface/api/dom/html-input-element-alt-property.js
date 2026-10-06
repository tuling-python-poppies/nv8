import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "alt", "alt");
export const alt = descriptor.get;
export const setAlt = descriptor.set;

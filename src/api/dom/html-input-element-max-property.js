import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "max", "max");
export const max = descriptor.get;
export const setMax = descriptor.set;

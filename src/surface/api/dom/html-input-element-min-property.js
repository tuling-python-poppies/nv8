import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "min", "min");
export const min = descriptor.get;
export const setMin = descriptor.set;

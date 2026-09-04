import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLButtonElement", "value", "value");
export const value = descriptor.get;
export const setValue = descriptor.set;

import { inputNumberReflection } from "./html-input-element-number-reflection.js";
const descriptor = inputNumberReflection("size", "size", 20, 1, false);
export const size = descriptor.get;
export const setSize = descriptor.set;

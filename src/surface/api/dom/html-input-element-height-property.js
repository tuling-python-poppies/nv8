import { inputNumberReflection } from "./html-input-element-number-reflection.js";
const descriptor = inputNumberReflection("height", "height", 0, 0, false);
export const height = descriptor.get;
export const setHeight = descriptor.set;

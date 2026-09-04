import { inputNumberReflection } from "./html-input-element-number-reflection.js";
const descriptor = inputNumberReflection("width", "width", 0, 0, false);
export const width = descriptor.get;
export const setWidth = descriptor.set;

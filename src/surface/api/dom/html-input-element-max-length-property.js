import { inputNumberReflection } from "./html-input-element-number-reflection.js";
const descriptor = inputNumberReflection("maxLength", "maxlength", -1, 0);
export const maxLength = descriptor.get;
export const setMaxLength = descriptor.set;

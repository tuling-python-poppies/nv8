import { inputNumberReflection } from "./html-input-element-number-reflection.js";
const descriptor = inputNumberReflection("minLength", "minlength", -1, 0);
export const minLength = descriptor.get;
export const setMinLength = descriptor.set;

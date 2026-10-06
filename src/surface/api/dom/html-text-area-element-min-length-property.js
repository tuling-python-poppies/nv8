import { textAreaNumberReflection } from "./html-text-area-element-number-reflection.js";
const descriptor = textAreaNumberReflection("minLength", "minlength", -1, false);
export const minLength = descriptor.get;
export const setMinLength = descriptor.set;

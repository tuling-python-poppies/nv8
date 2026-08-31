import { textAreaNumberReflection } from "./html-text-area-element-number-reflection.js";
const descriptor = textAreaNumberReflection("maxLength", "maxlength", -1, false);
export const maxLength = descriptor.get;
export const setMaxLength = descriptor.set;

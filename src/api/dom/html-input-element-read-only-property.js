import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLInputElement", "readOnly", "readonly");
export const readOnly = descriptor.get;
export const setReadOnly = descriptor.set;

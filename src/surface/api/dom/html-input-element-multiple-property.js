import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLInputElement", "multiple", "multiple");
export const multiple = descriptor.get;
export const setMultiple = descriptor.set;

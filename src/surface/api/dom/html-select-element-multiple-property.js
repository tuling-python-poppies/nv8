import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLSelectElement", "multiple", "multiple");
export const multiple = descriptor.get;
export const setMultiple = descriptor.set;

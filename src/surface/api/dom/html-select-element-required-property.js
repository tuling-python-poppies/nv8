import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLSelectElement", "required", "required");
export const required = descriptor.get;
export const setRequired = descriptor.set;

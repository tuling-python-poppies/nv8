import { longReflection } from "./html-reflection.js";

const descriptor = longReflection("HTMLLIElement", "value", "value");
export const value = descriptor.get;
export const setValue = descriptor.set;

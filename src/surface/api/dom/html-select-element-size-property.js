import { unsignedReflection } from "./html-reflection.js";
const descriptor = unsignedReflection("HTMLSelectElement", "size", "size");
export const size = descriptor.get;
export const setSize = descriptor.set;

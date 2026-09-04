import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "formTarget", "formtarget");
export const formTarget = descriptor.get;
export const setFormTarget = descriptor.set;

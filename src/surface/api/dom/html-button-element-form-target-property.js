import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLButtonElement", "formTarget", "formtarget");
export const formTarget = descriptor.get;
export const setFormTarget = descriptor.set;

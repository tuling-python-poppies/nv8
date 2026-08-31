import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTextAreaElement", "wrap", "wrap");
export const wrap = descriptor.get;
export const setWrap = descriptor.set;

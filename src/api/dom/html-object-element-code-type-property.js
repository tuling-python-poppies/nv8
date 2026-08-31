import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "codeType", "codetype");
export const codeType = descriptor.get;
export const setCodeType = descriptor.set;

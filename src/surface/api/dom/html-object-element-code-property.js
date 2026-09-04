import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "code", "code");
export const code = descriptor.get;
export const setCode = descriptor.set;

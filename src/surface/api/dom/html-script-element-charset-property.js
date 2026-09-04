import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLScriptElement", "charset", "charset");
export const charset = descriptor.get;
export const setCharset = descriptor.set;

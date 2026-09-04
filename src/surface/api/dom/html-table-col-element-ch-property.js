import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLTableColElement", "ch", "char");
export const ch = descriptor.get;
export const setCh = descriptor.set;

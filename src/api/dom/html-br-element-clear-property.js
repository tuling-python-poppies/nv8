import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLBRElement", "clear", "clear");
export const clear = descriptor.get;
export const setClear = descriptor.set;

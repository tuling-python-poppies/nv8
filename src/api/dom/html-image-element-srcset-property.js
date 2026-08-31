import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "srcset", "srcset");
export const srcset = descriptor.get;
export const setSrcset = descriptor.set;

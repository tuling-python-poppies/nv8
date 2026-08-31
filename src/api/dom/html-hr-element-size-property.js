import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLHRElement", "size", "size");
export const size = descriptor.get;
export const setSize = descriptor.set;

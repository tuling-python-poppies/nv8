import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLFormElement", "target", "target");
export const target = descriptor.get;
export const setTarget = descriptor.set;

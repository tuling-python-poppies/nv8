import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLOptGroupElement", "label", "label");
export const label = descriptor.get;
export const setLabel = descriptor.set;

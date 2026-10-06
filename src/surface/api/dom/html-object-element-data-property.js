import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "data", "data");
export const data = descriptor.get;
export const setData = descriptor.set;

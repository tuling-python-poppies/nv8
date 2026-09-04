import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "align", "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;

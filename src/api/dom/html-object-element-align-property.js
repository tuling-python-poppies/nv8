import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "align", "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;

import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableSectionElement", "align", "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;

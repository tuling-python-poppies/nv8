import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLLabelElement", "htmlFor", "for");
export const htmlFor = descriptor.get;
export const setHtmlFor = descriptor.set;

import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLEmbedElement", "width", "width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

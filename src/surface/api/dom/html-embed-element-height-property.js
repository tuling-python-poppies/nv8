import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLEmbedElement", "height", "height");
export const height = descriptor.get;
export const setHeight = descriptor.set;

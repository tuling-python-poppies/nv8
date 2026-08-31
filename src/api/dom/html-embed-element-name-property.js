import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLEmbedElement", "name", "name");
export const name = descriptor.get;
export const setName = descriptor.set;

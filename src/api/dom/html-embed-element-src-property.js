import { urlReflection } from "./html-reflection.js";

const descriptor = urlReflection("HTMLEmbedElement", "src", "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;

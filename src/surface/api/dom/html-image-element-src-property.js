import { urlReflection } from "./html-reflection.js";
const descriptor = urlReflection("HTMLImageElement", "src", "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;

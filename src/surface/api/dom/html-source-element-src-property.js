import { urlReflection } from "./html-reflection.js";

const descriptor = urlReflection("HTMLSourceElement", "src", "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;

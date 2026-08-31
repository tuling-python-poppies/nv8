import { urlReflection } from "./html-reflection.js";
const descriptor = urlReflection("HTMLInputElement", "src", "src");
export const src = descriptor.get;
export const setSrc = descriptor.set;

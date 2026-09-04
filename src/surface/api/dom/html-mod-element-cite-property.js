import { urlReflection } from "./html-reflection.js";

const descriptor = urlReflection("HTMLModElement", "cite", "cite");
export const cite = descriptor.get;
export const setCite = descriptor.set;

import { urlReflection } from "./html-reflection.js";

const descriptor = urlReflection("HTMLQuoteElement", "cite", "cite");
export const cite = descriptor.get;
export const setCite = descriptor.set;

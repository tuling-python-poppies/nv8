import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "hreflang", "hreflang");
export const hreflang = descriptor.get;
export const setHreflang = descriptor.set;

import { urlReflection } from "./html-reflection.js";
const descriptor = urlReflection("HTMLAnchorElement", "href", "href");
export const href = descriptor.get;
export const setHref = descriptor.set;

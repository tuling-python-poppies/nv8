import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "attributionSrc", "attributionsrc");
export const attributionSrc = descriptor.get;
export const setAttributionSrc = descriptor.set;

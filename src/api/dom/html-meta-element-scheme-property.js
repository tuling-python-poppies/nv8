import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLMetaElement", "scheme", "scheme");
export const scheme = descriptor.get;
export const setScheme = descriptor.set;

import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLMetaElement", "content", "content");
export const content = descriptor.get;
export const setContent = descriptor.set;

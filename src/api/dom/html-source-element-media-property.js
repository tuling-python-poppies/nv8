import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLSourceElement", "media", "media");
export const media = descriptor.get;
export const setMedia = descriptor.set;

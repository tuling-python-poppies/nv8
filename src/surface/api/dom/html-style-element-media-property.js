import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLStyleElement", "media", "media");
export const media = descriptor.get;
export const setMedia = descriptor.set;

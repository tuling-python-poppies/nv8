import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "media", "media");
export const media = descriptor.get;
export const setMedia = descriptor.set;

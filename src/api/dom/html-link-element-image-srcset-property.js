import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "imageSrcset", "imagesrcset");
export const imageSrcset = descriptor.get;
export const setImageSrcset = descriptor.set;

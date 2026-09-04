import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "imageSizes", "imagesizes");
export const imageSizes = descriptor.get;
export const setImageSizes = descriptor.set;

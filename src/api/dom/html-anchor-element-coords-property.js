import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "coords", "coords");
export const coords = descriptor.get;
export const setCoords = descriptor.set;

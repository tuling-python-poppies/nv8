import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "coords", "coords");
export const coords = descriptor.get;
export const setCoords = descriptor.set;

import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "useMap", "usemap");
export const useMap = descriptor.get;
export const setUseMap = descriptor.set;

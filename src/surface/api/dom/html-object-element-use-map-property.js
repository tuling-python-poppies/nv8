import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "useMap", "usemap");
export const useMap = descriptor.get;
export const setUseMap = descriptor.set;

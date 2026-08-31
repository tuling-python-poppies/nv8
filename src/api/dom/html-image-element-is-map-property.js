import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLImageElement", "isMap", "ismap");
export const isMap = descriptor.get;
export const setIsMap = descriptor.set;

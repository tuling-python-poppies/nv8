import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLFontElement", "color", "color");
export const color = descriptor.get;
export const setColor = descriptor.set;

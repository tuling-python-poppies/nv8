import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLFontElement", "face", "face");
export const face = descriptor.get;
export const setFace = descriptor.set;

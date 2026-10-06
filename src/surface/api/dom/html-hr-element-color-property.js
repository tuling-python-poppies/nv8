import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLHRElement", "color", "color");
export const color = descriptor.get;
export const setColor = descriptor.set;

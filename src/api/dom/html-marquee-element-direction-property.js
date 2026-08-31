import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLMarqueeElement", "direction", "direction");
export const direction = descriptor.get;
export const setDirection = descriptor.set;

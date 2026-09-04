import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLMarqueeElement", "behavior", "behavior");
export const behavior = descriptor.get;
export const setBehavior = descriptor.set;

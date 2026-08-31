import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLMarqueeElement", "bgColor", "bgcolor");
export const bgColor = descriptor.get;
export const setBgColor = descriptor.set;

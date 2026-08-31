import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";
const descriptor = marqueeNumberReflection("hspace", "hspace", 0);
export const hspace = descriptor.get;
export const setHspace = descriptor.set;

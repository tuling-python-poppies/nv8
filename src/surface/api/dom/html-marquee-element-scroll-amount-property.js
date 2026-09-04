import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";
const descriptor = marqueeNumberReflection("scrollAmount", "scrollamount", 6);
export const scrollAmount = descriptor.get;
export const setScrollAmount = descriptor.set;

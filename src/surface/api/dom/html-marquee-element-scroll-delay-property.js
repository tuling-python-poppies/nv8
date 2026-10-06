import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";
const descriptor = marqueeNumberReflection("scrollDelay", "scrolldelay", 85);
export const scrollDelay = descriptor.get;
export const setScrollDelay = descriptor.set;

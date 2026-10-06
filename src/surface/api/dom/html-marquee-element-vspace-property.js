import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";
const descriptor = marqueeNumberReflection("vspace", "vspace", 0);
export const vspace = descriptor.get;
export const setVspace = descriptor.set;

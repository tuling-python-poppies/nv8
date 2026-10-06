import { marqueeNumberReflection } from "./html-marquee-element-number-reflection.js";
const descriptor = marqueeNumberReflection("loop", "loop", -1, true);
export const loop = descriptor.get;
export const setLoop = descriptor.set;

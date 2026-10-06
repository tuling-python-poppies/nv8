import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "referrerPolicy", "referrerpolicy");
export const referrerPolicy = descriptor.get;
export const setReferrerPolicy = descriptor.set;

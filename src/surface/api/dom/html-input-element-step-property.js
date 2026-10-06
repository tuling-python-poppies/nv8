import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "step", "step");
export const step = descriptor.get;
export const setStep = descriptor.set;

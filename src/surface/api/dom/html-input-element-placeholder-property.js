import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "placeholder", "placeholder");
export const placeholder = descriptor.get;
export const setPlaceholder = descriptor.set;

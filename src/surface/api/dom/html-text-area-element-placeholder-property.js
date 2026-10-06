import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTextAreaElement", "placeholder", "placeholder");
export const placeholder = descriptor.get;
export const setPlaceholder = descriptor.set;

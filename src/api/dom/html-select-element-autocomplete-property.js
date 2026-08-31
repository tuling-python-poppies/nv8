import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLSelectElement", "autocomplete", "autocomplete");
export const autocomplete = descriptor.get;
export const setAutocomplete = descriptor.set;

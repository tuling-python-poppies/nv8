import { htmlBooleanDescriptor } from "./html-element-property.js";
const descriptor = htmlBooleanDescriptor("spellcheck", true);
export const spellcheck = descriptor.get;
export const setSpellcheck = descriptor.set;

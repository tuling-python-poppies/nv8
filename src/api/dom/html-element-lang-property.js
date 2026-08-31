import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("lang", "");
export const lang = descriptor.get;
export const setLang = descriptor.set;

import { htmlBooleanDescriptor } from "./html-element-property.js";
const descriptor = htmlBooleanDescriptor("hidden", false);
export const hidden = descriptor.get;
export const setHidden = descriptor.set;

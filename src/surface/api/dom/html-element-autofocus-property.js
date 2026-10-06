import { htmlBooleanDescriptor } from "./html-element-property.js";
const descriptor = htmlBooleanDescriptor("autofocus", false);
export const autofocus = descriptor.get;
export const setAutofocus = descriptor.set;

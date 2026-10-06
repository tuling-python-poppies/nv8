import { htmlBooleanDescriptor } from "./html-element-property.js";
const descriptor = htmlBooleanDescriptor("inert", false);
export const inert = descriptor.get;
export const setInert = descriptor.set;

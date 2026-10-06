import { elementStringProperty } from "./element-extended-property.js";
const descriptor = elementStringProperty("elementTiming", "elementtiming");
export const elementTiming = descriptor.get;
export const setElementTiming = descriptor.set;

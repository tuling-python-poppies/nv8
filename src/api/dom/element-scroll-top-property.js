import { elementNumberProperty } from "./element-extended-property.js";
const descriptor = elementNumberProperty("scrollTop");
export const scrollTop = descriptor.get;
export const setScrollTop = descriptor.set;

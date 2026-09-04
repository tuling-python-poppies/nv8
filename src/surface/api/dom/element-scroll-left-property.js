import { elementNumberProperty } from "./element-extended-property.js";
const descriptor = elementNumberProperty("scrollLeft");
export const scrollLeft = descriptor.get;
export const setScrollLeft = descriptor.set;

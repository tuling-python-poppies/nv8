import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onfullscreenerror");
export const onfullscreenerror = descriptor.get;
export const setOnfullscreenerror = descriptor.set;

import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onfullscreenchange");
export const onfullscreenchange = descriptor.get;
export const setOnfullscreenchange = descriptor.set;

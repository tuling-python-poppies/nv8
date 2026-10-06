import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onsearch");
export const onsearch = descriptor.get;
export const setOnsearch = descriptor.set;

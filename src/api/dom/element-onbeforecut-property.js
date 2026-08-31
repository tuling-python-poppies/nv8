import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onbeforecut");
export const onbeforecut = descriptor.get;
export const setOnbeforecut = descriptor.set;

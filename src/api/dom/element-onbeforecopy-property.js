import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onbeforecopy");
export const onbeforecopy = descriptor.get;
export const setOnbeforecopy = descriptor.set;

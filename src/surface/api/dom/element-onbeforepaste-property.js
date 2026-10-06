import { elementHandlerProperty } from "./element-extended-property.js";
const descriptor = elementHandlerProperty("onbeforepaste");
export const onbeforepaste = descriptor.get;
export const setOnbeforepaste = descriptor.set;

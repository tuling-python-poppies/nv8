import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onstorage");
export const onstorage = descriptor.get;
export const setOnstorage = descriptor.set;

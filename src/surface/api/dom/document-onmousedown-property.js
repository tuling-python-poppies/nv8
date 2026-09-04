import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmousedown");
export const onmousedown = descriptor.get;
export const setOnmousedown = descriptor.set;

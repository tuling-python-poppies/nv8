import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmouseup");
export const onmouseup = descriptor.get;
export const setOnmouseup = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmouseleave");
export const onmouseleave = descriptor.get;
export const setOnmouseleave = descriptor.set;

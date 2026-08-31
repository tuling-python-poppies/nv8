import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onsubmit");
export const onsubmit = descriptor.get;
export const setOnsubmit = descriptor.set;

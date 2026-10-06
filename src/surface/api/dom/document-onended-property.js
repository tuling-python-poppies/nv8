import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onended");
export const onended = descriptor.get;
export const setOnended = descriptor.set;

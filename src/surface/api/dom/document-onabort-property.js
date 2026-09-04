import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onabort");
export const onabort = descriptor.get;
export const setOnabort = descriptor.set;

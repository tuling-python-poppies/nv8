import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onseeked");
export const onseeked = descriptor.get;
export const setOnseeked = descriptor.set;

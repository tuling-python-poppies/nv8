import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onsuspend");
export const onsuspend = descriptor.get;
export const setOnsuspend = descriptor.set;

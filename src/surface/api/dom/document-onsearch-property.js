import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onsearch");
export const onsearch = descriptor.get;
export const setOnsearch = descriptor.set;

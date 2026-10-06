import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onseeking");
export const onseeking = descriptor.get;
export const setOnseeking = descriptor.set;

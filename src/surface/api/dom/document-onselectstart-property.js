import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onselectstart");
export const onselectstart = descriptor.get;
export const setOnselectstart = descriptor.set;

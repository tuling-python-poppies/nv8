import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onerror");
export const onerror = descriptor.get;
export const setOnerror = descriptor.set;

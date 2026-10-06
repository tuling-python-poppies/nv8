import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onstalled");
export const onstalled = descriptor.get;
export const setOnstalled = descriptor.set;

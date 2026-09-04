import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncuechange");
export const oncuechange = descriptor.get;
export const setOncuechange = descriptor.set;

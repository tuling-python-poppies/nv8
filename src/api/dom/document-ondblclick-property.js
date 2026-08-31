import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondblclick");
export const ondblclick = descriptor.get;
export const setOndblclick = descriptor.set;

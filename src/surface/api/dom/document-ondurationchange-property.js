import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("ondurationchange");
export const ondurationchange = descriptor.get;
export const setOndurationchange = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onprogress");
export const onprogress = descriptor.get;
export const setOnprogress = descriptor.set;

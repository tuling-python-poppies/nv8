import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onformdata");
export const onformdata = descriptor.get;
export const setOnformdata = descriptor.set;

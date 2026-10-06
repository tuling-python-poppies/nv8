import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onselect");
export const onselect = descriptor.get;
export const setOnselect = descriptor.set;

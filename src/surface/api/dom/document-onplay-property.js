import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onplay");
export const onplay = descriptor.get;
export const setOnplay = descriptor.set;

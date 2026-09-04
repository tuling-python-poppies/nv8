import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncancel");
export const oncancel = descriptor.get;
export const setOncancel = descriptor.set;

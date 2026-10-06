import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onkeypress");
export const onkeypress = descriptor.get;
export const setOnkeypress = descriptor.set;

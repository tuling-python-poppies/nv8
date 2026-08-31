import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onkeyup");
export const onkeyup = descriptor.get;
export const setOnkeyup = descriptor.set;

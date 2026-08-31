import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncommand");
export const oncommand = descriptor.get;
export const setOncommand = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onbeforematch");
export const onbeforematch = descriptor.get;
export const setOnbeforematch = descriptor.set;

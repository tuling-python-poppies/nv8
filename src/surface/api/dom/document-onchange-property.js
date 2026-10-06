import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onchange");
export const onchange = descriptor.get;
export const setOnchange = descriptor.set;

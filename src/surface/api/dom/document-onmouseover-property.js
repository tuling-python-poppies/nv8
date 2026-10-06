import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmouseover");
export const onmouseover = descriptor.get;
export const setOnmouseover = descriptor.set;

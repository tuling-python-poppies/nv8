import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onclick");
export const onclick = descriptor.get;
export const setOnclick = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerenter");
export const onpointerenter = descriptor.get;
export const setOnpointerenter = descriptor.set;

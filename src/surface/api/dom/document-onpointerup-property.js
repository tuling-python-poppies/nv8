import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerup");
export const onpointerup = descriptor.get;
export const setOnpointerup = descriptor.set;

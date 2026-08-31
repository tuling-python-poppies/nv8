import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointerleave");
export const onpointerleave = descriptor.get;
export const setOnpointerleave = descriptor.set;

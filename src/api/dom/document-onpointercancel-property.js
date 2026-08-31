import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onpointercancel");
export const onpointercancel = descriptor.get;
export const setOnpointercancel = descriptor.set;

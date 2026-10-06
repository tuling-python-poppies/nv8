import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onscrollend");
export const onscrollend = descriptor.get;
export const setOnscrollend = descriptor.set;

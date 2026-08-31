import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onmousewheel");
export const onmousewheel = descriptor.get;
export const setOnmousewheel = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onbeforepaste");
export const onbeforepaste = descriptor.get;
export const setOnbeforepaste = descriptor.set;

import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onwheel");
export const onwheel = descriptor.get;
export const setOnwheel = descriptor.set;

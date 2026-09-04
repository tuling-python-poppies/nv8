import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onresize");
export const onresize = descriptor.get;
export const setOnresize = descriptor.set;

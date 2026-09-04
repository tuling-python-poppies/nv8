import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onblur");
export const onblur = descriptor.get;
export const setOnblur = descriptor.set;

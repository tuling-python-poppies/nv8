import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onanimationstart");
export const onanimationstart = descriptor.get;
export const setOnanimationstart = descriptor.set;

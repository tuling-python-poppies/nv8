import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onanimationend");
export const onanimationend = descriptor.get;
export const setOnanimationend = descriptor.set;

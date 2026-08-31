import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onanimationiteration");
export const onanimationiteration = descriptor.get;
export const setOnanimationiteration = descriptor.set;

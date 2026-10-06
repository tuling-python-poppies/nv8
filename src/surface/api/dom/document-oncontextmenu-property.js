import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("oncontextmenu");
export const oncontextmenu = descriptor.get;
export const setOncontextmenu = descriptor.set;

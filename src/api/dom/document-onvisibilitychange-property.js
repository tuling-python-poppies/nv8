import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onvisibilitychange");
export const onvisibilitychange = descriptor.get;
export const setOnvisibilitychange = descriptor.set;

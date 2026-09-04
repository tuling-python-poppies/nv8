import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onprerenderingchange");
export const onprerenderingchange = descriptor.get;
export const setOnprerenderingchange = descriptor.set;

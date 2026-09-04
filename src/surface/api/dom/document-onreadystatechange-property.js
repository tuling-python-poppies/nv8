import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onreadystatechange");
export const onreadystatechange = descriptor.get;
export const setOnreadystatechange = descriptor.set;

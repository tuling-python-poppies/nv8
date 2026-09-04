import { documentHandlerDescriptor } from "./document-handler-property.js";
const descriptor = documentHandlerDescriptor("onbeforeinput");
export const onbeforeinput = descriptor.get;
export const setOnbeforeinput = descriptor.set;

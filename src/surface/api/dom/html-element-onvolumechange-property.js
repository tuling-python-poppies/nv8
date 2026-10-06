import { htmlElementHandlerDescriptor } from "./html-element-handler-property.js";
const descriptor = htmlElementHandlerDescriptor("onvolumechange");
export const onvolumechange = descriptor.get;
export const setOnvolumechange = descriptor.set;

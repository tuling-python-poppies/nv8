import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onunhandledrejection");
export const onunhandledrejection = descriptor.get;
export const setOnunhandledrejection = descriptor.set;

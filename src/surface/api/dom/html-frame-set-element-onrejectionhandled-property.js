import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("onrejectionhandled");
export const onrejectionhandled = descriptor.get;
export const setOnrejectionhandled = descriptor.set;

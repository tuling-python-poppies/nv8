import { frameSetHandlerProperty } from "./html-frame-set-element-handler-property.js";
const descriptor = frameSetHandlerProperty("ongamepadconnected");
export const ongamepadconnected = descriptor.get;
export const setOngamepadconnected = descriptor.set;

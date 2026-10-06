import { htmlStringDescriptor } from "./html-element-property.js";
const descriptor = htmlStringDescriptor("nonce", "");
export const nonce = descriptor.get;
export const setNonce = descriptor.set;

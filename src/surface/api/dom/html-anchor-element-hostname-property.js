import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("hostname");
export const hostname = descriptor.get;
export const setHostname = descriptor.set;

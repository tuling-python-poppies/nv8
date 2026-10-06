import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("protocol");
export const protocol = descriptor.get;
export const setProtocol = descriptor.set;

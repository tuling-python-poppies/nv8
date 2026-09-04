import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("hash");
export const hash = descriptor.get;
export const setHash = descriptor.set;

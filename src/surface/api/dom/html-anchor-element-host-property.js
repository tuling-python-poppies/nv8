import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("host");
export const host = descriptor.get;
export const setHost = descriptor.set;

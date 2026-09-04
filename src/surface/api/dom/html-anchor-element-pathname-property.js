import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("pathname");
export const pathname = descriptor.get;
export const setPathname = descriptor.set;

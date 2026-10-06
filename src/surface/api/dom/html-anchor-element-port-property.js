import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("port");
export const port = descriptor.get;
export const setPort = descriptor.set;

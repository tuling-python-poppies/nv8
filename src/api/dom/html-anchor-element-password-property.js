import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("password");
export const password = descriptor.get;
export const setPassword = descriptor.set;

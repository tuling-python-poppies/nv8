import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("username");
export const username = descriptor.get;
export const setUsername = descriptor.set;

import { anchorURLComponentProperty } from "./html-anchor-element-url-state.js";
const descriptor = anchorURLComponentProperty("search");
export const search = descriptor.get;
export const setSearch = descriptor.set;

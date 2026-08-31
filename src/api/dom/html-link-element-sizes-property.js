import { linkTokenListProperty } from "./html-link-element-token-list.js";
const descriptor = linkTokenListProperty("sizes", "sizes");
export const sizes = descriptor.get;
export const setSizes = descriptor.set;

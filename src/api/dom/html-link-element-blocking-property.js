import { linkTokenListProperty } from "./html-link-element-token-list.js";
const descriptor = linkTokenListProperty("blocking", "blocking");
export const blocking = descriptor.get;
export const setBlocking = descriptor.set;

import { linkTokenListProperty } from "./html-link-element-token-list.js";
const descriptor = linkTokenListProperty("relList", "rel");
export const relList = descriptor.get;
export const setRelList = descriptor.set;

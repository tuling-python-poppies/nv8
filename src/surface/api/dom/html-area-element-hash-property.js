import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("hash");
export const hash = descriptor.get;
export const setHash = descriptor.set;

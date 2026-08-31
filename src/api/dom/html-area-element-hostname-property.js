import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("hostname");
export const hostname = descriptor.get;
export const setHostname = descriptor.set;

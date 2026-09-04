import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("protocol");
export const protocol = descriptor.get;
export const setProtocol = descriptor.set;

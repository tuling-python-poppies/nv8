import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("host");
export const host = descriptor.get;
export const setHost = descriptor.set;

import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("pathname");
export const pathname = descriptor.get;
export const setPathname = descriptor.set;

import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("port");
export const port = descriptor.get;
export const setPort = descriptor.set;

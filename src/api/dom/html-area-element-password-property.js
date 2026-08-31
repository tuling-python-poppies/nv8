import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("password");
export const password = descriptor.get;
export const setPassword = descriptor.set;

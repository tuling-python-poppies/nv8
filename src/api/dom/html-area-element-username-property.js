import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("username");
export const username = descriptor.get;
export const setUsername = descriptor.set;

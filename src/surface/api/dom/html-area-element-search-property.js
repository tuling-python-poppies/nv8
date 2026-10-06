import { areaURLComponentProperty } from "./html-area-element-url-state.js";
const descriptor = areaURLComponentProperty("search");
export const search = descriptor.get;
export const setSearch = descriptor.set;

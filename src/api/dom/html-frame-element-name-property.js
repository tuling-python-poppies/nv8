import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("name", "name");
export const name = descriptor.get;
export const setName = descriptor.set;

import { frameStringProperty } from "./html-frame-element-string-property.js";
const descriptor = frameStringProperty("longDesc", "longdesc");
export const longDesc = descriptor.get;
export const setLongDesc = descriptor.set;

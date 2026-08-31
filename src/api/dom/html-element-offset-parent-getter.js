import { htmlReadonlyDescriptor } from "./html-element-property.js";
export const offsetParent = htmlReadonlyDescriptor("offsetParent", () => null).get;

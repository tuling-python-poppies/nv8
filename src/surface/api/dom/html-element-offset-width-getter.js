import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { elementLayoutRect } from "./element-layout.js";
export const offsetWidth = htmlReadonlyDescriptor(
  "offsetWidth",
  element => Math.round(elementLayoutRect(element).width),
).get;

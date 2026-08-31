import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { elementLayoutRect } from "./element-layout.js";
export const offsetHeight = htmlReadonlyDescriptor(
  "offsetHeight",
  element => Math.round(elementLayoutRect(element).height),
).get;

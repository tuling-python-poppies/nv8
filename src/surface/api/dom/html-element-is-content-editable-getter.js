import { htmlReadonlyDescriptor } from "./html-element-property.js";
import { htmlStringProperty } from "./html-element-state.js";
export const isContentEditable = htmlReadonlyDescriptor("isContentEditable", element => htmlStringProperty(element, "contentEditable", "inherit") === "true").get;

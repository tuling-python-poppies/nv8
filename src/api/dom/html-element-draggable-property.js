import { htmlBooleanDescriptor } from "./html-element-property.js";
const descriptor = htmlBooleanDescriptor("draggable", false);
export const draggable = descriptor.get;
export const setDraggable = descriptor.set;

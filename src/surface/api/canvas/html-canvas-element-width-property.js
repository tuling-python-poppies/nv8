import { htmlCanvasDimensionProperty } from "./html-canvas-element-property.js";
const descriptor = htmlCanvasDimensionProperty("width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

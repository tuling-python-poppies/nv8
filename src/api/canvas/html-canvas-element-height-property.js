import { htmlCanvasDimensionProperty } from "./html-canvas-element-property.js";
const descriptor = htmlCanvasDimensionProperty("height");
export const height = descriptor.get;
export const setHeight = descriptor.set;

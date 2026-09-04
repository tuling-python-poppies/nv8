import { dimensionProperty } from "./offscreen-canvas-property.js";
const descriptor = dimensionProperty("width");
export const width = descriptor.get;
export const setWidth = descriptor.set;

import { dimensionProperty } from "./offscreen-canvas-property.js";
const descriptor = dimensionProperty("height");
export const height = descriptor.get;
export const setHeight = descriptor.set;

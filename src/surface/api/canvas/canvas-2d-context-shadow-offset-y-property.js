import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("shadowOffsetY");
export const shadowOffsetY = descriptor.get; export const setShadowOffsetY = descriptor.set;

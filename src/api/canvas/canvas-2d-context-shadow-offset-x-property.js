import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("shadowOffsetX");
export const shadowOffsetX = descriptor.get; export const setShadowOffsetX = descriptor.set;

import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("shadowColor");
export const shadowColor = descriptor.get; export const setShadowColor = descriptor.set;

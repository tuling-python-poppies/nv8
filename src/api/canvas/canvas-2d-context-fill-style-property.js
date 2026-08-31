import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("fillStyle");
export const fillStyle = descriptor.get; export const setFillStyle = descriptor.set;

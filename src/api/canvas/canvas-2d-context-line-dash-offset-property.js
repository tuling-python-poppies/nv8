import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("lineDashOffset");
export const lineDashOffset = descriptor.get; export const setLineDashOffset = descriptor.set;

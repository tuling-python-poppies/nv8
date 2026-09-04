import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("lineCap");
export const lineCap = descriptor.get; export const setLineCap = descriptor.set;

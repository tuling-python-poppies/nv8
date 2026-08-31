import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("lineWidth");
export const lineWidth = descriptor.get; export const setLineWidth = descriptor.set;

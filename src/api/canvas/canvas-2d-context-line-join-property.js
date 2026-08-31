import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("lineJoin");
export const lineJoin = descriptor.get; export const setLineJoin = descriptor.set;

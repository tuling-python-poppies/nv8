import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("miterLimit");
export const miterLimit = descriptor.get; export const setMiterLimit = descriptor.set;

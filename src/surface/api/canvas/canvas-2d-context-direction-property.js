import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("direction");
export const direction = descriptor.get; export const setDirection = descriptor.set;

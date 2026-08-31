import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("globalCompositeOperation");
export const globalCompositeOperation = descriptor.get; export const setGlobalCompositeOperation = descriptor.set;

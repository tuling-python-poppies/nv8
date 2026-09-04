import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("textAlign");
export const textAlign = descriptor.get; export const setTextAlign = descriptor.set;

import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("textBaseline");
export const textBaseline = descriptor.get; export const setTextBaseline = descriptor.set;

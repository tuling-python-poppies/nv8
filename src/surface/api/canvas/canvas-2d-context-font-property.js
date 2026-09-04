import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("font");
export const font = descriptor.get; export const setFont = descriptor.set;

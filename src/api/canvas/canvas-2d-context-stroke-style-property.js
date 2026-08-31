import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("strokeStyle");
export const strokeStyle = descriptor.get; export const setStrokeStyle = descriptor.set;

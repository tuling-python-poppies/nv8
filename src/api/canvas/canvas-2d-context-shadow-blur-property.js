import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("shadowBlur");
export const shadowBlur = descriptor.get; export const setShadowBlur = descriptor.set;

import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("imageSmoothingEnabled");
export const imageSmoothingEnabled = descriptor.get; export const setImageSmoothingEnabled = descriptor.set;

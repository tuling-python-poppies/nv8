import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("imageSmoothingQuality");
export const imageSmoothingQuality = descriptor.get; export const setImageSmoothingQuality = descriptor.set;

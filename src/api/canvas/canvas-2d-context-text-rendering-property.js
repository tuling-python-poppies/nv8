import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("textRendering");
export const textRendering = descriptor.get; export const setTextRendering = descriptor.set;

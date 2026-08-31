import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("fontStretch");
export const fontStretch = descriptor.get; export const setFontStretch = descriptor.set;

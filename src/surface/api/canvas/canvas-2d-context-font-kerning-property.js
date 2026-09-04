import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("fontKerning");
export const fontKerning = descriptor.get; export const setFontKerning = descriptor.set;

import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("fontVariantCaps");
export const fontVariantCaps = descriptor.get; export const setFontVariantCaps = descriptor.set;

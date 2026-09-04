import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("letterSpacing");
export const letterSpacing = descriptor.get; export const setLetterSpacing = descriptor.set;

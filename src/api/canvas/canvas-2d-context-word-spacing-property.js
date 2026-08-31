import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("wordSpacing");
export const wordSpacing = descriptor.get; export const setWordSpacing = descriptor.set;

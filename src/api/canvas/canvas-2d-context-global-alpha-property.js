import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("globalAlpha");
export const globalAlpha = descriptor.get; export const setGlobalAlpha = descriptor.set;

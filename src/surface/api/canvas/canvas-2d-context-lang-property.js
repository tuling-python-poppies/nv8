import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("lang");
export const lang = descriptor.get; export const setLang = descriptor.set;

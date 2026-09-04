import { canvasContextProperty } from "./canvas-2d-context-property.js";
const descriptor = canvasContextProperty("filter");
export const filter = descriptor.get; export const setFilter = descriptor.set;

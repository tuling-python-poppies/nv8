import { canvasContextReadonlyProperty } from "./canvas-2d-context-property.js";
export const canvas = canvasContextReadonlyProperty("canvas", state => state.canvas);

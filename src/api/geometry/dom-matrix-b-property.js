import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("b");
export const b = descriptor.get; export const setB = descriptor.set;

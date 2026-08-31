import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("d");
export const d = descriptor.get; export const setD = descriptor.set;

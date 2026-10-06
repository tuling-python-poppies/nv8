import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("c");
export const c = descriptor.get; export const setC = descriptor.set;

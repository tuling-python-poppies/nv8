import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("e");
export const e = descriptor.get; export const setE = descriptor.set;

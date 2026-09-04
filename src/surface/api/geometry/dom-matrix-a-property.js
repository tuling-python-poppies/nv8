import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("a");
export const a = descriptor.get; export const setA = descriptor.set;

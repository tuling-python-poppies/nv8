import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("f");
export const f = descriptor.get; export const setF = descriptor.set;

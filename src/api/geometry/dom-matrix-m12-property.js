import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m12");
export const m12 = descriptor.get; export const setM12 = descriptor.set;

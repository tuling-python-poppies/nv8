import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m44");
export const m44 = descriptor.get; export const setM44 = descriptor.set;

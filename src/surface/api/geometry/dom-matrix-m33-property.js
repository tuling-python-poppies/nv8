import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m33");
export const m33 = descriptor.get; export const setM33 = descriptor.set;

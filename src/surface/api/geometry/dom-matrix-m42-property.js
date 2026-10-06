import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m42");
export const m42 = descriptor.get; export const setM42 = descriptor.set;

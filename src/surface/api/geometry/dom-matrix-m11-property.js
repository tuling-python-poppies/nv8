import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m11");
export const m11 = descriptor.get; export const setM11 = descriptor.set;

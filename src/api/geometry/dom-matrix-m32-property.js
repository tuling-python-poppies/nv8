import { mutableMatrixComponent } from "./dom-matrix-component.js";
const descriptor = mutableMatrixComponent("m32");
export const m32 = descriptor.get; export const setM32 = descriptor.set;

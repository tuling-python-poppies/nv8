import { mutablePointProperty } from "./dom-point-property.js";
const descriptor = mutablePointProperty("w");
export const w = descriptor.get;
export const setW = descriptor.set;

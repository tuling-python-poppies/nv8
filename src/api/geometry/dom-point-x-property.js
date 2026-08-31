import { mutablePointProperty } from "./dom-point-property.js";
const descriptor = mutablePointProperty("x");
export const x = descriptor.get;
export const setX = descriptor.set;

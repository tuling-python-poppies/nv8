import { mutablePointProperty } from "./dom-point-property.js";
const descriptor = mutablePointProperty("y");
export const y = descriptor.get;
export const setY = descriptor.set;

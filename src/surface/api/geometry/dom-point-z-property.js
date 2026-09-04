import { mutablePointProperty } from "./dom-point-property.js";
const descriptor = mutablePointProperty("z");
export const z = descriptor.get;
export const setZ = descriptor.set;

import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("rangeStart");
export const rangeStart = descriptor.get;
export const setRangeStart = descriptor.set;

import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("rangeEnd");
export const rangeEnd = descriptor.get;
export const setRangeEnd = descriptor.set;

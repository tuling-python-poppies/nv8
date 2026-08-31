import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("startTime");
export const startTime = descriptor.get;
export const setStartTime = descriptor.set;

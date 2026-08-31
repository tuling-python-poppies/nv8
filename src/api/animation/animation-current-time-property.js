import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("currentTime");
export const currentTime = descriptor.get;
export const setCurrentTime = descriptor.set;

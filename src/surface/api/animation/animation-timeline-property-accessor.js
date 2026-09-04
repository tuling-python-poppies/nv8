import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("timeline");
export const timeline = descriptor.get;
export const setTimeline = descriptor.set;

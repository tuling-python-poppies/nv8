import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("onfinish");
export const onfinish = descriptor.get;
export const setOnfinish = descriptor.set;

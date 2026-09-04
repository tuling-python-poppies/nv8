import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("onremove");
export const onremove = descriptor.get;
export const setOnremove = descriptor.set;

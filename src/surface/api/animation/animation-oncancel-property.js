import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("oncancel");
export const oncancel = descriptor.get;
export const setOncancel = descriptor.set;

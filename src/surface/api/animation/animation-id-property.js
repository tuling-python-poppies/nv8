import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("id");
export const id = descriptor.get;
export const setId = descriptor.set;

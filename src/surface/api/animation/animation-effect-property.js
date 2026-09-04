import { animationProperty } from "./animation-property.js";
const descriptor = animationProperty("effect");
export const effect = descriptor.get;
export const setEffect = descriptor.set;

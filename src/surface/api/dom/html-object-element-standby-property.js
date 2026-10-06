import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "standby", "standby");
export const standby = descriptor.get;
export const setStandby = descriptor.set;

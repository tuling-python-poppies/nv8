import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLTimeElement", "dateTime", "datetime");
export const dateTime = descriptor.get;
export const setDateTime = descriptor.set;

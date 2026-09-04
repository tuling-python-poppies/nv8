import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLModElement", "dateTime", "datetime");
export const dateTime = descriptor.get;
export const setDateTime = descriptor.set;

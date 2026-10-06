import { longReflection } from "./html-reflection.js";

const descriptor = longReflection("HTMLOListElement", "start", "start", 1);
export const start = descriptor.get;
export const setStart = descriptor.set;

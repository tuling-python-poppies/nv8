import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "ping", "ping");
export const ping = descriptor.get;
export const setPing = descriptor.set;

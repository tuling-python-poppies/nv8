import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "ping", "ping");
export const ping = descriptor.get;
export const setPing = descriptor.set;

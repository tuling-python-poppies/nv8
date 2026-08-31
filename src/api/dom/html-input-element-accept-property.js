import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "accept", "accept");
export const accept = descriptor.get;
export const setAccept = descriptor.set;

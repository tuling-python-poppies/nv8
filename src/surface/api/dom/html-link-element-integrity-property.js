import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLLinkElement", "integrity", "integrity");
export const integrity = descriptor.get;
export const setIntegrity = descriptor.set;

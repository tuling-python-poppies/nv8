import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "codeBase", "codebase");
export const codeBase = descriptor.get;
export const setCodeBase = descriptor.set;

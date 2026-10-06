import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLObjectElement", "declare", "declare");
export const declare = descriptor.get;
export const setDeclare = descriptor.set;

import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLDetailsElement", "name", "name");
export const name = descriptor.get;
export const setName = descriptor.set;

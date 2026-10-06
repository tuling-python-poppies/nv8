import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLInputElement", "incremental", "incremental");
export const incremental = descriptor.get;
export const setIncremental = descriptor.set;

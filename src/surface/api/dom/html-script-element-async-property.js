import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLScriptElement", "async", "async");
export const asyncValue = descriptor.get;
export const setAsync = descriptor.set;

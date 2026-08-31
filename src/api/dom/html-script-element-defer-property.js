import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLScriptElement", "defer", "defer");
export const defer = descriptor.get;
export const setDefer = descriptor.set;

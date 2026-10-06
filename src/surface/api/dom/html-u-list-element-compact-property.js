import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLUListElement", "compact", "compact");
export const compact = descriptor.get;
export const setCompact = descriptor.set;

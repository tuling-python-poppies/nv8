import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLMenuElement", "compact", "compact");
export const compact = descriptor.get;
export const setCompact = descriptor.set;

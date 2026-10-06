import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLDetailsElement", "open", "open");
export const open = descriptor.get;
export const setOpen = descriptor.set;

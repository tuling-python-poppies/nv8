import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLAreaElement", "noHref", "nohref");
export const noHref = descriptor.get;
export const setNoHref = descriptor.set;

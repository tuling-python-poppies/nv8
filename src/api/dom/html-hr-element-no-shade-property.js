import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLHRElement", "noShade", "noshade");
export const noShade = descriptor.get;
export const setNoShade = descriptor.set;

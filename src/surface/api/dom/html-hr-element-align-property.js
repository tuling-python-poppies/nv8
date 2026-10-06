import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLHRElement", "align", "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;

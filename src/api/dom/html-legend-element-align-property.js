import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection("HTMLLegendElement", "align", "align");
export const align = descriptor.get;
export const setAlign = descriptor.set;

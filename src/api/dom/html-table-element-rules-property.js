import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLTableElement", "rules", "rules");
export const rules = descriptor.get;
export const setRules = descriptor.set;

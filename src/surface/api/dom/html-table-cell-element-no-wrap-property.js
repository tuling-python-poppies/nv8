import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLTableCellElement", "noWrap", "nowrap");
export const noWrap = descriptor.get;
export const setNoWrap = descriptor.set;

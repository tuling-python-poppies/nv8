import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLFrameSetElement", "rows", "rows");
export const rows = descriptor.get;
export const setRows = descriptor.set;

import { urlReflection } from "./html-reflection.js";
const descriptor = urlReflection("HTMLImageElement", "longDesc", "longdesc");
export const longDesc = descriptor.get;
export const setLongDesc = descriptor.set;

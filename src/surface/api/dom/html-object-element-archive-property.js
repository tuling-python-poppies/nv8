import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLObjectElement", "archive", "archive");
export const archive = descriptor.get;
export const setArchive = descriptor.set;

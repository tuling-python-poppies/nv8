import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAreaElement", "download", "download");
export const download = descriptor.get;
export const setDownload = descriptor.set;

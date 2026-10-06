import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLAnchorElement", "download", "download");
export const download = descriptor.get;
export const setDownload = descriptor.set;

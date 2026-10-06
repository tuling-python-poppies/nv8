import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLImageElement", "loading", "loading");
export const loading = descriptor.get;
export const setLoading = descriptor.set;

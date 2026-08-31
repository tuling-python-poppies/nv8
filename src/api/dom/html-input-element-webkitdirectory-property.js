import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLInputElement", "webkitdirectory", "webkitdirectory");
export const webkitdirectory = descriptor.get;
export const setWebkitdirectory = descriptor.set;

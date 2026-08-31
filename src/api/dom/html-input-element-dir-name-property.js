import { stringReflection } from "./html-reflection.js";
const descriptor = stringReflection("HTMLInputElement", "dirName", "dirname");
export const dirName = descriptor.get;
export const setDirName = descriptor.set;

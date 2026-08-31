import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLImageElement", "sharedStorageWritable", "sharedstoragewritable");
export const sharedStorageWritable = descriptor.get;
export const setSharedStorageWritable = descriptor.set;

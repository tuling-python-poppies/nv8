import { booleanReflection } from "./html-reflection.js";

const descriptor = booleanReflection("HTMLScriptElement", "noModule", "nomodule");
export const noModule = descriptor.get;
export const setNoModule = descriptor.set;

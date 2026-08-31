import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLOptionElement", "defaultSelected", "selected");
export const defaultSelected = descriptor.get;
export const setDefaultSelected = descriptor.set;

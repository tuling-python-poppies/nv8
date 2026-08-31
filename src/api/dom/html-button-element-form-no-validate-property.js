import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLButtonElement", "formNoValidate", "formnovalidate");
export const formNoValidate = descriptor.get;
export const setFormNoValidate = descriptor.set;

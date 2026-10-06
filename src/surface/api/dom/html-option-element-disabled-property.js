import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection("HTMLOptionElement", "disabled", "disabled");
export const disabled = descriptor.get;
export const setDisabled = descriptor.set;

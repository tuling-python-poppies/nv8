import { booleanReflection } from "./html-reflection.js";
const descriptor = booleanReflection(
  "HTMLFormElement",
  "noValidate",
  "novalidate",
);
export const noValidate = descriptor.get;
export const setNoValidate = descriptor.set;

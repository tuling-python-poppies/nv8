import { stringReflection } from "./html-reflection.js";

const descriptor = stringReflection(
  "HTMLParamElement",
  "valueType",
  "valuetype",
);
export const valueType = descriptor.get;
export const setValueType = descriptor.set;

import { elementInternalsMethod } from "./element-internals-method.js";
export const checkValidity = elementInternalsMethod("checkValidity", 0, record => {
  const result = record.validity.valid;
  if (!result) record.target.dispatchEvent(new Event("invalid", { cancelable: true }));
  return result;
});

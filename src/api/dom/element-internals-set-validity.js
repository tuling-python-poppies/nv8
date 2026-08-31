import { elementInternalsMethod } from "./element-internals-method.js";
import { setInternalsValidity } from "./element-internals-state.js";
export const setValidity = elementInternalsMethod("setValidity", 1, (record, args) => {
  setInternalsValidity(record, args[0] ?? {}, args[1] ?? "");
});

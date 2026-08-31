import { registerNativeFunction } from "../../webidl/native-function.js";
import { selectOptions } from "./html-options-collection-state.js";
import { requireSelect } from "./html-select-element-state.js";
export const values = {
  values() {
    requireSelect(this);
    return selectOptions(this)[Symbol.iterator]();
  },
}.values;
registerNativeFunction(values, "values");

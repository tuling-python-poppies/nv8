import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import {
  selectSelectedIndex,
  setSelectSelectedIndex,
} from "./html-select-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get selectedIndex() {
    const result = selectSelectedIndex(this);
    traceGetter("window.HTMLSelectElement.prototype.selectedIndex", "HTMLSelectElement", result);
    return result;
  },
  set selectedIndex(value) {
    setSelectSelectedIndex(this, value);
  },
}, "selectedIndex");
export const selectedIndex = descriptor.get;
export const setSelectedIndex = descriptor.set;
registerNativeGetter(selectedIndex, "selectedIndex");
registerNativeFunction(setSelectedIndex, "set selectedIndex");

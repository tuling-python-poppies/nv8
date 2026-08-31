import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireAttr, setAttrValue } from "./attr-state.js";

export const setValue = Object.getOwnPropertyDescriptor({
  set value(value) {
    requireAttr(this);
    setAttrValue(this, value);
  },
}, "value").set;
registerNativeFunction(setValue, "set value");

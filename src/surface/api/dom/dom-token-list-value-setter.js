import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireDOMTokenList } from "./dom-token-list-state.js";
import { setAttributeValue } from "./element-state.js";

export const setValue = Object.getOwnPropertyDescriptor({
  set value(value) {
    const state = requireDOMTokenList(this);
    setAttributeValue(state.element, state.attributeName, `${value}`);
  },
}, "value").set;
registerNativeFunction(setValue, "set value");

import { registerNativeFunction } from "../../webidl/native-function.js";
import { setAttributeValue } from "./element-state.js";

export const setClassName = Object.getOwnPropertyDescriptor({
  set className(value) {
    setAttributeValue(this, "class", `${value}`);
  },
}, "className").set;
registerNativeFunction(setClassName, "set className");

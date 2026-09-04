import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setAttributeValue } from "./element-state.js";

export const setId = Object.getOwnPropertyDescriptor({
  set id(value) {
    setAttributeValue(this, "id", `${value}`);
  },
}, "id").set;
registerNativeFunction(setId, "set id");

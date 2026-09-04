import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setData } from "./character-data-algorithms.js";

export const setDataCallback = Object.getOwnPropertyDescriptor({
  set data(value) {
    setData(this, value);
  },
}, "data").set;
registerNativeFunction(setDataCallback, "set data");

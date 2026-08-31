import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireNode } from "./node-state.js";

export const data = Object.getOwnPropertyDescriptor({
  get data() {
    const value = requireNode(this).nodeValue ?? "";
    traceGetter("window.CharacterData.prototype.data", "CharacterData", value);
    return value;
  },
}, "data").get;
registerNativeGetter(data, "data");

import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMemoryInfo } from "./console-memory-state.js";

export const usedJSHeapSize = Object.getOwnPropertyDescriptor({
  get usedJSHeapSize() {
    requireMemoryInfo(this);
    return 10_000_000;
  },
}, "usedJSHeapSize").get;
registerNativeGetter(usedJSHeapSize, "usedJSHeapSize");

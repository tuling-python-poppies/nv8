import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMemoryInfo } from "./console-memory-state.js";

export const jsHeapSizeLimit = Object.getOwnPropertyDescriptor({
  get jsHeapSizeLimit() {
    requireMemoryInfo(this);
    return 3_760_000_000;
  },
}, "jsHeapSizeLimit").get;
registerNativeGetter(jsHeapSizeLimit, "jsHeapSizeLimit");

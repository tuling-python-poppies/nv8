import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const webkitPersistentStorage = Object.getOwnPropertyDescriptor({
  get webkitPersistentStorage() {
    const value = navigatorService(this, "webkitPersistentStorage");
    traceGetter(
      "window.Navigator.prototype.webkitPersistentStorage",
      "Navigator",
      value,
    );
    return value;
  },
}, "webkitPersistentStorage").get;
registerNativeGetter(webkitPersistentStorage, "webkitPersistentStorage");
export function installNavigatorPersistentStorage() {
  definePrototypeGetter(
    Navigator.prototype,
    "webkitPersistentStorage",
    webkitPersistentStorage,
  );
}

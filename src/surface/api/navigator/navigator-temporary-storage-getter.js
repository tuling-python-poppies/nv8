import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const webkitTemporaryStorage = Object.getOwnPropertyDescriptor({
  get webkitTemporaryStorage() {
    const value = navigatorService(this, "webkitTemporaryStorage");
    traceGetter(
      "window.Navigator.prototype.webkitTemporaryStorage",
      "Navigator",
      value,
    );
    return value;
  },
}, "webkitTemporaryStorage").get;
registerNativeGetter(webkitTemporaryStorage, "webkitTemporaryStorage");
export function installNavigatorTemporaryStorage() {
  definePrototypeGetter(
    Navigator.prototype,
    "webkitTemporaryStorage",
    webkitTemporaryStorage,
  );
}

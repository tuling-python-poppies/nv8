import * as runtime from "../navigation-api-runtime.js";
import { installDispatchedGlobalGetter } from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobalGetter(
    "navigation",
    runtime.createNavigation,
    false,
  );
}

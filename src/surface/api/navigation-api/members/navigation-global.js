import * as runtime from "../navigation-api-runtime.js";
import { installDispatchedGlobalGetter } from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobalGetter(
    "navigation",
    runtime.createNavigation,
    false,
  );
}

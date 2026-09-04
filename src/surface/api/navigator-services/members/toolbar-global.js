import * as runtime from "../navigator-services-runtime.js";
import { installDispatchedGlobalGetter } from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobalGetter(
    "toolbar",
    runtime.createBarProp,
    true,
  );
}

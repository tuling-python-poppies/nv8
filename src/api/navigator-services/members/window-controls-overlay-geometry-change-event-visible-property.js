import * as runtime from "../navigator-services-runtime.js";
import { WindowControlsOverlayGeometryChangeEvent } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    WindowControlsOverlayGeometryChangeEvent,
    "visible",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

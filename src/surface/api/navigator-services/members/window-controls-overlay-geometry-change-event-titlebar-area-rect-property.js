import * as runtime from "../navigator-services-runtime.js";
import { WindowControlsOverlayGeometryChangeEvent } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    WindowControlsOverlayGeometryChangeEvent,
    "titlebarAreaRect",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

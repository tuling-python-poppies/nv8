import * as runtime from "../longtail-events-runtime.js";
import { TextFormatUpdateEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedMethod,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    TextFormatUpdateEvent,
    "getTextFormats",
    0,
    runtime.longtailEventOperation,
  );
}

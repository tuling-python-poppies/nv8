import * as runtime from "../longtail-events-runtime.js";
import { IDBVersionChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    IDBVersionChangeEvent,
    "dataLossMessage",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}

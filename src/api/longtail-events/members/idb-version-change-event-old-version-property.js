import * as runtime from "../longtail-events-runtime.js";
import { IDBVersionChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    IDBVersionChangeEvent,
    "oldVersion",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}

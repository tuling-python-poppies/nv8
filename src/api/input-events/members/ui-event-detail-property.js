import { UIEvent } from "../input-events-runtime.js";
import { installInputEventAccessor } from "../input-event-install-support.js";

export function install() {
  installInputEventAccessor(UIEvent, "detail");
}

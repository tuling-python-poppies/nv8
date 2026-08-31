import { MouseEvent } from "../input-events-runtime.js";
import { installInputEventMethod } from "../input-event-install-support.js";

export function install() {
  installInputEventMethod(MouseEvent, "getModifierState", 1);
}

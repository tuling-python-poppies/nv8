import { CompositionEvent } from "../input-events-runtime.js";
import { installInputEventMethod } from "../input-event-install-support.js";

export function install() {
  installInputEventMethod(CompositionEvent, "initCompositionEvent", 1);
}

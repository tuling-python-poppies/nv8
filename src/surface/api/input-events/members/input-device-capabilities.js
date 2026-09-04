import { InputDeviceCapabilities } from "../input-events-runtime.js";
import { INPUT_EVENT_SURFACES } from "../input-events-surface.js";
import {
  installInputEventAccessor,
  installInputEventConstant,
  installInputEventConstructorBacklink,
  installInputEventGlobal,
  installInputEventIterator,
  installInputEventMethod,
  installInputEventRelation,
  installInputEventTag,
} from "../input-event-install-support.js";

export function installGlobal() {
  installInputEventGlobal(InputDeviceCapabilities);
}

export function installRelation() {
  installInputEventRelation(
    InputDeviceCapabilities,
    INPUT_EVENT_SURFACES.InputDeviceCapabilities,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(InputDeviceCapabilities, "firesTouchEvents");
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(InputDeviceCapabilities);
}

export function installTag() {
  installInputEventTag(InputDeviceCapabilities);
}

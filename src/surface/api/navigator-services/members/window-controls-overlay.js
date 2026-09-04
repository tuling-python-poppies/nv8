import * as runtime from "../navigator-services-runtime.js";
import { WindowControlsOverlay } from "../navigator-services-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(WindowControlsOverlay);
}

export function installRelation() {
  installDispatchedRelation(
    WindowControlsOverlay,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    WindowControlsOverlay,
    "visible",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    WindowControlsOverlay,
    "ongeometrychange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    WindowControlsOverlay,
    "getTitlebarAreaRect",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(WindowControlsOverlay);
}

export function installTag() {
  installDispatchedTag(WindowControlsOverlay);
}

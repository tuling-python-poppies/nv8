import * as runtime from "../navigator-services-runtime.js";
import { VirtualKeyboard } from "../navigator-services-runtime.js";
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
  installDispatchedGlobal(VirtualKeyboard);
}

export function installRelation() {
  installDispatchedRelation(
    VirtualKeyboard,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    VirtualKeyboard,
    "boundingRect",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    VirtualKeyboard,
    "overlaysContent",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    VirtualKeyboard,
    "ongeometrychange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    VirtualKeyboard,
    "hide",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    VirtualKeyboard,
    "show",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(VirtualKeyboard);
}

export function installTag() {
  installDispatchedTag(VirtualKeyboard);
}

import * as runtime from "../navigator-services-runtime.js";
import { NavigatorManagedData } from "../navigator-services-runtime.js";
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
  installDispatchedGlobal(NavigatorManagedData);
}

export function installRelation() {
  installDispatchedRelation(
    NavigatorManagedData,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    NavigatorManagedData,
    "onmanagedconfigurationchange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    NavigatorManagedData,
    "getManagedConfiguration",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigatorManagedData);
}

export function installTag() {
  installDispatchedTag(NavigatorManagedData);
}

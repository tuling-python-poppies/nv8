import * as runtime from "../navigator-services-runtime.js";
import { BatteryManager } from "../navigator-services-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BatteryManager);
}

export function installRelation() {
  installDispatchedRelation(
    BatteryManager,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BatteryManager,
    "charging",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BatteryManager,
    "chargingTime",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BatteryManager,
    "dischargingTime",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BatteryManager,
    "level",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    BatteryManager,
    "onchargingchange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    BatteryManager,
    "onchargingtimechange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    BatteryManager,
    "ondischargingtimechange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    BatteryManager,
    "onlevelchange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BatteryManager);
}

export function installTag() {
  installDispatchedTag(BatteryManager);
}

import * as runtime from "../external-device-runtime.js";
import { HIDDevice } from "../external-device-runtime.js";
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
  installDispatchedGlobal(HIDDevice);
}

export function installRelation() {
  installDispatchedRelation(
    HIDDevice,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    HIDDevice,
    "oninputreport",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    HIDDevice,
    "opened",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    HIDDevice,
    "vendorId",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    HIDDevice,
    "productId",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    HIDDevice,
    "productName",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    HIDDevice,
    "collections",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    HIDDevice,
    "close",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    HIDDevice,
    "forget",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    HIDDevice,
    "open",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    HIDDevice,
    "receiveFeatureReport",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    HIDDevice,
    "sendFeatureReport",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    HIDDevice,
    "sendReport",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(HIDDevice);
}

export function installTag() {
  installDispatchedTag(HIDDevice);
}

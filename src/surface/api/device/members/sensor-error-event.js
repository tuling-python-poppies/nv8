import * as runtime from "../device-runtime.js";
import { SensorErrorEvent } from "../device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SensorErrorEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SensorErrorEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SensorErrorEvent);
}

export function installTag() {
  installDispatchedTag(SensorErrorEvent);
}

import * as runtime from "../device-runtime.js";
import { GamepadEvent } from "../device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GamepadEvent);
}

export function installRelation() {
  installDispatchedRelation(
    GamepadEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GamepadEvent);
}

export function installTag() {
  installDispatchedTag(GamepadEvent);
}

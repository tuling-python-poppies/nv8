import * as runtime from "../navigator-services-runtime.js";
import { VirtualKeyboardGeometryChangeEvent } from "../navigator-services-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(VirtualKeyboardGeometryChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    VirtualKeyboardGeometryChangeEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(VirtualKeyboardGeometryChangeEvent);
}

export function installTag() {
  installDispatchedTag(VirtualKeyboardGeometryChangeEvent);
}

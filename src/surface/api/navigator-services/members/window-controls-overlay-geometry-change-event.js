import * as runtime from "../navigator-services-runtime.js";
import { WindowControlsOverlayGeometryChangeEvent } from "../navigator-services-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(WindowControlsOverlayGeometryChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    WindowControlsOverlayGeometryChangeEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(WindowControlsOverlayGeometryChangeEvent);
}

export function installTag() {
  installDispatchedTag(WindowControlsOverlayGeometryChangeEvent);
}

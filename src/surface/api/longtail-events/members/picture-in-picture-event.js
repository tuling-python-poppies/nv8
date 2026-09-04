import * as runtime from "../longtail-events-runtime.js";
import { PictureInPictureEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PictureInPictureEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PictureInPictureEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PictureInPictureEvent);
}

export function installTag() {
  installDispatchedTag(PictureInPictureEvent);
}

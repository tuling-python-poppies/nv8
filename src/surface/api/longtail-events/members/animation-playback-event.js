import * as runtime from "../longtail-events-runtime.js";
import { AnimationPlaybackEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AnimationPlaybackEvent);
}

export function installRelation() {
  installDispatchedRelation(
    AnimationPlaybackEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AnimationPlaybackEvent);
}

export function installTag() {
  installDispatchedTag(AnimationPlaybackEvent);
}

import * as runtime from "../longtail-events-runtime.js";
import { FontFaceSetLoadEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(FontFaceSetLoadEvent);
}

export function installRelation() {
  installDispatchedRelation(
    FontFaceSetLoadEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(FontFaceSetLoadEvent);
}

export function installTag() {
  installDispatchedTag(FontFaceSetLoadEvent);
}

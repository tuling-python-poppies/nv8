import * as runtime from "../longtail-events-runtime.js";
import { DocumentPictureInPictureEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DocumentPictureInPictureEvent);
}

export function installRelation() {
  installDispatchedRelation(
    DocumentPictureInPictureEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DocumentPictureInPictureEvent);
}

export function installTag() {
  installDispatchedTag(DocumentPictureInPictureEvent);
}

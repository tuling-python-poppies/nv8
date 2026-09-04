import * as runtime from "../longtail-events-runtime.js";
import { MIDIConnectionEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MIDIConnectionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MIDIConnectionEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MIDIConnectionEvent);
}

export function installTag() {
  installDispatchedTag(MIDIConnectionEvent);
}

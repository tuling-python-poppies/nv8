import * as runtime from "../longtail-events-runtime.js";
import { MIDIMessageEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MIDIMessageEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MIDIMessageEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MIDIMessageEvent);
}

export function installTag() {
  installDispatchedTag(MIDIMessageEvent);
}

import * as runtime from "../audio-runtime.js";
import { OfflineAudioCompletionEvent } from "../audio-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    OfflineAudioCompletionEvent,
    "renderedBuffer",
    runtime.audioProperty,
    runtime.setAudioProperty,
    false,
  );
}

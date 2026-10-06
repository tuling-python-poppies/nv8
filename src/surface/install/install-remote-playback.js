import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cancelWatchAvailability } from "../api/media/remote-playback-cancel-watch-availability.js";
import {
  RemotePlayback,
  installRemotePlaybackConstructor,
} from "../api/media/remote-playback-constructor.js";
import { prompt } from "../api/media/remote-playback-prompt.js";
import { state } from "../api/media/remote-playback-state-getter.js";
import { watchAvailability } from "../api/media/remote-playback-watch-availability.js";
import { remotePlaybackHandlerPropertyTable } from "../api/media/remote-playback-handler-property-members.js";

export function installRemotePlayback() {
  installRemotePlaybackConstructor();
  definePrototypeGetter(RemotePlayback.prototype, "state", state);
  for (const [name, entry] of remotePlaybackHandlerPropertyTable) definePrototypeAccessor(RemotePlayback.prototype, name, entry.get, entry.set);
  definePrototypeMethod(RemotePlayback.prototype, "cancelWatchAvailability", cancelWatchAvailability);
  definePrototypeMethod(RemotePlayback.prototype, "prompt", prompt);
  definePrototypeMethod(RemotePlayback.prototype, "watchAvailability", watchAvailability);
  defineConstructorBacklink(RemotePlayback.prototype, RemotePlayback);
  defineToStringTag(RemotePlayback.prototype, "RemotePlayback");
}

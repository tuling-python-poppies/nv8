import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { cancelWatchAvailability } from "../api/media/remote-playback-cancel-watch-availability.js";
import {
  RemotePlayback,
  installRemotePlaybackConstructor,
} from "../api/media/remote-playback-constructor.js";
import { onconnect, setOnconnect } from "../api/media/remote-playback-onconnect-property.js";
import { onconnecting, setOnconnecting } from "../api/media/remote-playback-onconnecting-property.js";
import { ondisconnect, setOndisconnect } from "../api/media/remote-playback-ondisconnect-property.js";
import { prompt } from "../api/media/remote-playback-prompt.js";
import { state } from "../api/media/remote-playback-state-getter.js";
import { watchAvailability } from "../api/media/remote-playback-watch-availability.js";
export function installRemotePlayback() {
  installRemotePlaybackConstructor();
  definePrototypeGetter(RemotePlayback.prototype, "state", state);
  definePrototypeAccessor(RemotePlayback.prototype, "onconnecting", onconnecting, setOnconnecting);
  definePrototypeAccessor(RemotePlayback.prototype, "onconnect", onconnect, setOnconnect);
  definePrototypeAccessor(RemotePlayback.prototype, "ondisconnect", ondisconnect, setOndisconnect);
  definePrototypeMethod(RemotePlayback.prototype, "cancelWatchAvailability", cancelWatchAvailability);
  definePrototypeMethod(RemotePlayback.prototype, "prompt", prompt);
  definePrototypeMethod(RemotePlayback.prototype, "watchAvailability", watchAvailability);
  defineConstructorBacklink(RemotePlayback.prototype, RemotePlayback);
  defineToStringTag(RemotePlayback.prototype, "RemotePlayback");
}

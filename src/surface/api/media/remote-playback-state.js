import { initializeEventTarget } from "../event/event-target-state.js";
import { RemotePlayback } from "./remote-playback-constructor.js";
const remotePlaybackState = new WeakMap();
export function createRemotePlayback() {
  const remote = Object.create(RemotePlayback.prototype);
  initializeEventTarget(remote);
  remotePlaybackState.set(remote, {
    onconnecting: null,
    onconnect: null,
    ondisconnect: null,
    nextWatchId: 0,
  });
  return remote;
}
export function requireRemotePlayback(remote) {
  const state = remotePlaybackState.get(remote);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

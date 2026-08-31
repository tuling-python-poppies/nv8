import { remotePlaybackHandlerProperty } from "./remote-playback-handler-property.js";
const descriptor = remotePlaybackHandlerProperty("onconnecting");
export const onconnecting = descriptor.get;
export const setOnconnecting = descriptor.set;

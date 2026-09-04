import { remotePlaybackHandlerProperty } from "./remote-playback-handler-property.js";
const descriptor = remotePlaybackHandlerProperty("onconnect");
export const onconnect = descriptor.get;
export const setOnconnect = descriptor.set;

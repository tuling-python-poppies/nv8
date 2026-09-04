import { remotePlaybackHandlerProperty } from "./remote-playback-handler-property.js";
const descriptor = remotePlaybackHandlerProperty("ondisconnect");
export const ondisconnect = descriptor.get;
export const setOndisconnect = descriptor.set;
